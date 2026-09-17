import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { companyImportSchema } from "@/app/lib/validation";
import { mapCompanyImport } from "@/app/lib/companyContactImport";
import { checkApiKey, unauthorizedResponse } from "@/app/lib/apiKeyAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RECORDS = 500;
const API_KEY_ENV = "LEAD_COMPANY_IMPORT_API_KEY";

type ImportError = { index: number; company?: string; message: string };

function toRecords(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object" && Array.isArray((body as { companies?: unknown }).companies)) {
    return (body as { companies: unknown[] }).companies;
  }
  return [body];
}

export async function POST(request: Request) {
  if (!checkApiKey(request, API_KEY_ENV)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const records = toRecords(body);
  if (records.length === 0) {
    return NextResponse.json(
      { ok: false, message: "No company records found in the payload." },
      { status: 422 }
    );
  }
  if (records.length > MAX_RECORDS) {
    return NextResponse.json(
      { ok: false, message: `Too many records (max ${MAX_RECORDS}).` },
      { status: 422 }
    );
  }

  let created = 0;
  let updated = 0;
  const errors: ImportError[] = [];

  for (let index = 0; index < records.length; index++) {
    const raw = records[index];
    const nameGuess =
      typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>).name : undefined;

    const parsed = companyImportSchema.safeParse(raw);
    if (!parsed.success) {
      errors.push({
        index,
        company: typeof nameGuess === "string" ? nameGuess : undefined,
        message: parsed.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`).join("; "),
      });
      continue;
    }

    try {
      const mapped = mapCompanyImport(parsed.data);
      const existing = await prisma.lead.findUnique({ where: { website: mapped.website } });

      const data = {
        companyName: mapped.companyName,
        website: mapped.website,
        industry: mapped.industry,
      };

      await prisma.$transaction(async (tx) => {
        if (existing) {
          // Only replace the "Website" social entry plus whatever social
          // profiles this payload carries; leave contact-sourced socials
          // (LinkedIn added via the contacts endpoint, etc.) untouched.
          await tx.socialProfile.deleteMany({
            where: { leadId: existing.id, platform: { in: mapped.socials.map((s) => s.platform) } },
          });
          await tx.lead.update({
            where: { id: existing.id },
            data: {
              ...data,
              notes: existing.notes || mapped.notes,
              profile: {
                ...(existing.profile as Record<string, unknown> | null),
                company: mapped.profile,
              } as Prisma.InputJsonValue,
              socials: { create: mapped.socials },
            },
          });
        } else {
          await tx.lead.create({
            data: {
              ...data,
              notes: mapped.notes,
              profile: { company: mapped.profile } as Prisma.InputJsonValue,
              socials: { create: mapped.socials },
            },
          });
        }
      });

      if (existing) updated += 1;
      else created += 1;
    } catch (error) {
      console.error(`Company import failed at index ${index}:`, error);
      errors.push({
        index,
        company: typeof nameGuess === "string" ? nameGuess : undefined,
        message: "Unexpected error while saving this record.",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    summary: { total: records.length, created, updated, failed: errors.length },
    errors,
  });
}
