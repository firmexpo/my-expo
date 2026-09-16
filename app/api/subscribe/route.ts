import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { subscriberSchema } from "@/app/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const parsed = subscriberSchema.safeParse(body);

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

  const { name, email, phone, industry } = parsed.data;
  const cleanPhone = phone && phone.length > 0 ? phone : null;

  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded ? forwarded.split(",")[0].trim().slice(0, 45) : null;

  try {
    await prisma.subscriber.create({
      data: { name, email, phone: cleanPhone, industry, ipAddress },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "You're on the list. We'll be in touch when the floor opens.",
      },
      { status: 201 }
    );
  } catch (error) {
    // P2002 = unique constraint violation on email — treat as an update
    // rather than an error, so re-submitting just refreshes their details.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      try {
        await prisma.subscriber.update({
          where: { email },
          data: { name, phone: cleanPhone, industry },
        });
        return NextResponse.json(
          {
            ok: true,
            message: "You're already on the list — we've updated your details.",
          },
          { status: 200 }
        );
      } catch (updateError) {
        console.error("Subscriber update failed:", updateError);
      }
    }

    console.error("Subscriber insert failed:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong on our end. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
