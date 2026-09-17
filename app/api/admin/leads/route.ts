import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { leadSchema } from "@/app/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status")?.trim();

  const where: Prisma.LeadWhereInput = {};
  if (status) where.status = status as Prisma.LeadWhereInput["status"];
  if (q) {
    where.OR = [
      { companyName: { contains: q } },
      { contactName: { contains: q } },
      { email: { contains: q } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    include: { socials: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, leads });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please check the form.", fieldErrors },
      { status: 422 }
    );
  }

  const {
    socials,
    contactName,
    phone,
    website,
    industry,
    notes,
    leadSource,
    leadOwner,
    lastContactedAt,
    nextFollowUpAt,
    ...rest
  } = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        ...rest,
        contactName: contactName || null,
        phone: phone || null,
        website: website || null,
        industry: industry || null,
        notes: notes || null,
        leadSource: leadSource || null,
        leadOwner: leadOwner || null,
        lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : null,
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : null,
        socials: {
          create: socials.map((s) => ({ platform: s.platform, url: s.url })),
        },
      },
      include: { socials: true },
    });
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[] | string | undefined) ?? "";
      const onWebsite = String(target).includes("website");
      return NextResponse.json(
        {
          ok: false,
          message: onWebsite
            ? "A lead with that website already exists."
            : "A lead with that email already exists.",
          fieldErrors: onWebsite
            ? { website: "Already in use by another lead." }
            : { email: "Already in use by another lead." },
        },
        { status: 409 }
      );
    }
    console.error("Lead create failed:", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
