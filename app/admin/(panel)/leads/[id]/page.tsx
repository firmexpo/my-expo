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
    include: { socials: true, contacts: { orderBy: { createdAt: "desc" } } },
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
            email: lead.email ?? "",
            phone: lead.phone ?? "",
            website: lead.website ?? "",
            industry: lead.industry ?? "",
            status: lead.status,
            notes: lead.notes ?? "",
            leadSource: lead.leadSource ?? "",
            leadOwner: lead.leadOwner ?? "",
            leadScore: lead.leadScore,
            priority: lead.priority,
            lastContactedAt: lead.lastContactedAt
              ? lead.lastContactedAt.toISOString().slice(0, 10)
              : "",
            nextFollowUpAt: lead.nextFollowUpAt
              ? lead.nextFollowUpAt.toISOString().slice(0, 10)
              : "",
            socials: lead.socials.map((s) => ({
              platform: s.platform,
              url: s.url,
            })),
          }}
        />
      </div>

      {lead.contacts.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            Core members ({lead.contacts.length})
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {lead.contacts.map((c) => (
              <li key={c.id} className="rounded-lg border border-line px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink">
                    {c.name || [c.firstName, c.lastName].filter(Boolean).join(" ") || "Unnamed contact"}
                  </span>
                  {c.decisionMaker && (
                    <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[11px] text-signal">
                      Decision maker
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-ink-dim">
                  {[c.jobTitle, c.department].filter(Boolean).join(" · ") || "—"}
                </p>
                <p className="mt-1 font-data text-xs text-ink-faint">
                  {c.workEmail || "no work email"}
                  {c.mobilePhone ? ` · ${c.mobilePhone}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lead.profile !== null && (
        <div className="mt-10 max-w-2xl">
          <details className="rounded-lg border border-line">
            <summary className="cursor-pointer select-none px-4 py-3 text-sm text-ink-dim hover:text-ink">
              Enriched profile data (from import)
            </summary>
            <pre className="overflow-x-auto border-t border-line px-4 py-3 font-data text-xs text-ink-dim">
              {JSON.stringify(lead.profile, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
