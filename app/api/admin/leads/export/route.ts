import { prisma } from "@/app/lib/prisma";
import { csvResponse, toCsv } from "@/app/lib/csv";
import { LEAD_PRIORITY_LABELS, LEAD_STATUS_LABELS } from "@/app/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const leads = await prisma.lead.findMany({
    include: { socials: true, contacts: true },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Company",
    "Contact",
    "Email",
    "Phone",
    "Website",
    "Industry",
    "Status",
    "Lead Source",
    "Lead Owner",
    "Lead Score",
    "Priority",
    "Last Contacted",
    "Next Follow-up",
    "Core Members",
    "Social Profiles",
    "Notes",
    "Created At",
  ];

  const rows = leads.map((lead) => [
    lead.companyName,
    lead.contactName ?? "",
    lead.email ?? "",
    lead.phone ?? "",
    lead.website ?? "",
    lead.industry ?? "",
    LEAD_STATUS_LABELS[lead.status],
    lead.leadSource ?? "",
    lead.leadOwner ?? "",
    String(lead.leadScore),
    LEAD_PRIORITY_LABELS[lead.priority],
    lead.lastContactedAt ? lead.lastContactedAt.toISOString().slice(0, 10) : "",
    lead.nextFollowUpAt ? lead.nextFollowUpAt.toISOString().slice(0, 10) : "",
    lead.contacts
      .map((c) => `${c.name ?? [c.firstName, c.lastName].filter(Boolean).join(" ")}${c.jobTitle ? ` (${c.jobTitle})` : ""}`)
      .join(" | "),
    lead.socials.map((s) => `${s.platform}: ${s.url}`).join(" | "),
    lead.notes ?? "",
    lead.createdAt.toISOString(),
  ]);

  const csv = toCsv(headers, rows);
  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`firm-expo-leads-${date}.csv`, csv);
}
