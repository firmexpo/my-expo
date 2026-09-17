import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { leadSchema } from "@/app/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ ok: false, message: "Invalid id." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { socials: true },
  });

  if (!lead) {
    return NextResponse.json({ ok: false, message: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ ok: false, message: "Invalid id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Status-only updates (from the leads table dropdown) skip full validation.
  if (
    typeof body === "object" &&
    body !== null &&
    Object.keys(body).length === 1 &&
    "status" in body
  ) {
    const status = String((body as Record<string, unknown>).status);
    try {
      const lead = await prisma.lead.update({
        where: { id },
        data: { status: status as Prisma.LeadUpdateInput["status"] },
        include: { socials: true },
      });
      return NextResponse.json({ ok: true, lead });
    } catch (error) {
      console.error("Lead status update failed:", error);
      return NextResponse.json(
        { ok: false, message: "Could not update status." },
        { status: 500 }
      );
    }
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

  const { socials, contactName, phone, industry, notes, ...rest } = parsed.data;

  try {
    const lead = await prisma.$transaction(async (tx) => {
      await tx.socialProfile.deleteMany({ where: { leadId: id } });
      return tx.lead.update({
        where: { id },
        data: {
          ...rest,
          contactName: contactName || null,
          phone: phone || null,
          industry: industry || null,
          notes: notes || null,
          socials: {
            create: socials.map((s) => ({ platform: s.platform, url: s.url })),
          },
        },
        include: { socials: true },
      });
    });
    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "A lead with that email already exists.",
          fieldErrors: { email: "Already in use by another lead." },
        },
        { status: 409 }
      );
    }
    console.error("Lead update failed:", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ ok: false, message: "Invalid id." }, { status: 400 });
  }

  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead delete failed:", error);
    return NextResponse.json(
      { ok: false, message: "Could not delete lead." },
      { status: 500 }
    );
  }
}
