import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import LeadForm from "../../../components/LeadForm";

export const dynamic = "force-dynamic";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { socials: true },
  });

  if (!lead) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {lead.companyName}
      </h1>
      <p className="mt-1 text-sm text-ink-dim">Edit this lead&apos;s details.</p>
      <div className="mt-8">
        <LeadForm
          leadId={lead.id}
          initialValues={{
            companyName: lead.companyName,
            contactName: lead.contactName ?? "",
            email: lead.email,
            phone: lead.phone ?? "",
            industry: lead.industry ?? "",
            status: lead.status,
            notes: lead.notes ?? "",
            socials: lead.socials.map((s) => ({
              platform: s.platform,
              url: s.url,
            })),
          }}
        />
      </div>
    </div>
  );
}
