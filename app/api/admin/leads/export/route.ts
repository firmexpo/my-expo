import { prisma } from "@/app/lib/prisma";
import { csvResponse, toCsv } from "@/app/lib/csv";
import { LEAD_STATUS_LABELS } from "@/app/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const leads = await prisma.lead.findMany({
    include: { socials: true },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Company",
    "Contact",
    "Email",
    "Phone",
    "Industry",
    "Status",
    "Social Profiles",
    "Notes",
    "Created At",
  ];

  const rows = leads.map((lead) => [
    lead.companyName,
    lead.contactName ?? "",
    lead.email,
    lead.phone ?? "",
    lead.industry ?? "",
    LEAD_STATUS_LABELS[lead.status],
    lead.socials.map((s) => `${s.platform}: ${s.url}`).join(" | "),
    lead.notes ?? "",
    lead.createdAt.toISOString(),
  ]);

  const csv = toCsv(headers, rows);
  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`firm-expo-leads-${date}.csv`, csv);
}
