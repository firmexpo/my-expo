import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import {
  LeadImportValidationError,
  normalizeImportPayload,
  parseAndMapLead,
} from "@/app/lib/leadImport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RECORDS = 500;

type ImportError = { index: number; company?: string; message: string };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const records = normalizeImportPayload(body);
  if (records.length === 0) {
    return NextResponse.json(
      { ok: false, message: "No lead records found in the payload." },
      { status: 422 }
    );
  }
  if (records.length > MAX_RECORDS) {
    return NextResponse.json(
      {
        ok: false,
        message: `Too many records in one import (max ${MAX_RECORDS}). Split it into smaller batches.`,
      },
      { status: 422 }
    );
  }

  let created = 0;
  let updated = 0;
  const errors: ImportError[] = [];

  for (const { index, data } of records) {
    const companyNameGuess =
      typeof data === "object" && data !== null
        ? ((data as Record<string, unknown>).company as Record<string, unknown> | undefined)
            ?.name
        : undefined;

    try {
      const mapped = parseAndMapLead(data);

      const existing = await prisma.lead.findUnique({ where: { email: mapped.email } });

      const baseData = {
        companyName: mapped.companyName,
        contactName: mapped.contactName,
        email: mapped.email,
        phone: mapped.phone,
        website: mapped.website,
        industry: mapped.industry,
        status: mapped.status,
        notes: mapped.notes,
        leadSource: mapped.leadSource,
        leadOwner: mapped.leadOwner,
        leadScore: mapped.leadScore,
        priority: mapped.priority,
        lastContactedAt: mapped.lastContactedAt,
        nextFollowUpAt: mapped.nextFollowUpAt,
        profile: mapped.profile as Prisma.InputJsonValue,
      };

      await prisma.$transaction(async (tx) => {
        if (existing) {
          await tx.socialProfile.deleteMany({ where: { leadId: existing.id } });
          await tx.lead.update({
            where: { id: existing.id },
            data: {
              ...baseData,
              socials: { create: mapped.socials },
            },
          });
        } else {
          await tx.lead.create({
            data: {
              ...baseData,
              socials: { create: mapped.socials },
            },
          });
        }
      });

      if (existing) updated += 1;
      else created += 1;
    } catch (error) {
      if (error instanceof LeadImportValidationError) {
        errors.push({
          index,
          company: typeof companyNameGuess === "string" ? companyNameGuess : undefined,
          message: error.issues.join("; "),
        });
        continue;
      }
      console.error(`Lead import failed at index ${index}:`, error);
      errors.push({
        index,
        company: typeof companyNameGuess === "string" ? companyNameGuess : undefined,
        message: "Unexpected error while saving this record.",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    summary: {
      total: records.length,
      created,
      updated,
      failed: errors.length,
    },
    errors,
  });
}
