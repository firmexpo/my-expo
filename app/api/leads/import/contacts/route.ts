import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { contactImportSchema, contactsBatchMetaSchema } from "@/app/lib/validation";
import { mapContactImport } from "@/app/lib/companyContactImport";
import { checkApiKey, unauthorizedResponse } from "@/app/lib/apiKeyAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RECORDS = 1000;
const API_KEY_ENV = "LEAD_CONTACTS_IMPORT_API_KEY";

type ImportError = { index: number; name?: string; message: string };
type Batch = { website?: string; lead_id?: number | string; contacts: unknown[] };

/**
 * Accepts:
 *   { website | lead_id, contacts: [...] }   (one batch, shared company)
 *   [ { website | lead_id, contacts: [...] }, ... ]  (multiple batches)
 *   [ { website | lead_id, name, ... }, ... ]  (bare contacts, each carrying its own website/lead_id)
 */
function toBatches(body: unknown): Batch[] {
  if (Array.isArray(body)) {
    // Could be an array of batches, or a bare array of contacts.
    if (body.every((b) => b && typeof b === "object" && Array.isArray((b as Record<string, unknown>).contacts))) {
      return body as Batch[];
    }
    return [{ contacts: body }];
  }
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.contacts)) return [obj as unknown as Batch];
  }
  return [{ contacts: [body] }];
}

export async function POST(request: Request) {
  if (!checkApiKey(request, API_KEY_ENV)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const batches = toBatches(body);
  const totalContacts = batches.reduce((n, b) => n + (b.contacts?.length ?? 0), 0);
  if (totalContacts === 0) {
    return NextResponse.json(
      { ok: false, message: "No contact records found in the payload." },
      { status: 422 }
    );
  }
  if (totalContacts > MAX_RECORDS) {
    return NextResponse.json(
      { ok: false, message: `Too many contacts (max ${MAX_RECORDS}).` },
      { status: 422 }
    );
  }

  let created = 0;
  let updated = 0;
  const errors: ImportError[] = [];
  let cursor = 0;

  // Cache lead lookups within this request so a batch of 200 contacts for
  // one company doesn't hit the DB 200 times just to resolve the lead.
  const leadCache = new Map<string, number | null>();

  async function resolveLeadId(websiteKey: string | null, leadId: number | null): Promise<number | null> {
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      return lead?.id ?? null;
    }
    if (!websiteKey) return null;
    if (leadCache.has(websiteKey)) return leadCache.get(websiteKey) ?? null;
    const lead = await prisma.lead.findUnique({ where: { website: websiteKey } });
    leadCache.set(websiteKey, lead?.id ?? null);
    return lead?.id ?? null;
  }

  for (const batch of batches) {
    const envelope = contactsBatchMetaSchema.safeParse({
      website: (batch as Record<string, unknown>).website,
      lead_id: (batch as Record<string, unknown>).lead_id,
    });
    const contactsRaw = Array.isArray(batch.contacts) ? batch.contacts : [];

    for (const raw of contactsRaw) {
      const index = cursor++;
      const nameGuess =
        typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>).name : undefined;

      const parsed = contactImportSchema.safeParse(raw);
      if (!parsed.success) {
        errors.push({
          index,
          name: typeof nameGuess === "string" ? nameGuess : undefined,
          message: parsed.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`).join("; "),
        });
        continue;
      }

      const mapped = mapContactImport(parsed.data, {
        website: envelope.success ? envelope.data.website : undefined,
        leadId: envelope.success ? envelope.data.lead_id : undefined,
      });

      const leadId = await resolveLeadId(mapped.websiteKey, mapped.leadId);
      if (!leadId) {
        errors.push({
          index,
          name: mapped.name ?? undefined,
          message:
            "Couldn't resolve which company this contact belongs to — provide a website or lead_id that matches an existing lead (import the company first).",
        });
        continue;
      }

      try {
        const data = {
          leadId,
          name: mapped.name,
          firstName: mapped.firstName,
          lastName: mapped.lastName,
          jobTitle: mapped.jobTitle,
          department: mapped.department,
          seniorityLevel: mapped.seniorityLevel,
          roleCategory: mapped.roleCategory,
          decisionMaker: mapped.decisionMaker,
          mobilePhone: mapped.mobilePhone,
          officePhone: mapped.officePhone,
          linkedin: mapped.linkedin,
          twitter: mapped.twitter,
          facebook: mapped.facebook,
          city: mapped.city,
          state: mapped.state,
          country: mapped.country,
          sourceUrl: mapped.sourceUrl,
          verified: mapped.verified,
          confidenceScore: mapped.confidenceScore,
        };

        if (mapped.workEmail) {
          const existing = await prisma.leadContact.findUnique({
            where: { workEmail: mapped.workEmail },
          });
          if (existing) {
            await prisma.leadContact.update({
              where: { id: existing.id },
              data: { ...data, workEmail: mapped.workEmail },
            });
            updated += 1;
          } else {
            await prisma.leadContact.create({ data: { ...data, workEmail: mapped.workEmail } });
            created += 1;
          }
        } else {
          // No stable identity without an email — always inserted fresh.
          await prisma.leadContact.create({ data });
          created += 1;
        }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          errors.push({ index, name: mapped.name ?? undefined, message: "That work email is already in use." });
          continue;
        }
        console.error(`Contact import failed at index ${index}:`, error);
        errors.push({
          index,
          name: mapped.name ?? undefined,
          message: "Unexpected error while saving this record.",
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    summary: { total: totalContacts, created, updated, failed: errors.length },
    errors,
  });
}
