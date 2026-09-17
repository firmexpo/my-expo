import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/app/lib/validation";
import LeadStatusSelect from "../../components/LeadStatusSelect";
import DeleteLeadButton from "../../components/DeleteLeadButton";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

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

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Leads
          </h1>
          <p className="mt-1 text-sm text-ink-dim">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
            {status ? ` · ${LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ?? status}` : ""}
            {q ? ` · matching "${q}"` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this downloads a file, not a page route */}
          <a
            href="/api/admin/leads/export"
            className="rounded-md border border-line px-4 py-2 text-sm text-ink-dim transition-colors hover:border-signal hover:text-ink"
          >
            Export CSV
          </a>
          <Link
            href="/admin/leads/new"
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal-soft"
          >
            Add lead
          </Link>
        </div>
      </div>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search company, contact, or email"
          className="w-full rounded-md border border-line bg-bg-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-signal sm:max-w-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-line bg-bg-panel px-4 py-2.5 text-sm text-ink focus:border-signal"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-line px-4 py-2.5 text-sm text-ink-dim transition-colors hover:border-signal hover:text-ink"
        >
          Filter
        </button>
        {(q || status) && (
          <Link
            href="/admin/leads"
            className="flex items-center px-2 text-sm text-ink-faint hover:text-ink"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-8 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-ink-faint">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Socials</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-ink hover:text-signal"
                  >
                    {lead.companyName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-dim">{lead.contactName || "—"}</td>
                <td className="px-4 py-3 text-ink-dim">
                  <a href={`mailto:${lead.email}`} className="hover:text-signal">
                    {lead.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-ink-dim">{lead.industry || "—"}</td>
                <td className="px-4 py-3">
                  {lead.socials.length === 0 ? (
                    <span className="text-ink-faint">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {lead.socials.map((s) => (
                        <a
                          key={s.id}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={s.url}
                          className="rounded border border-line px-1.5 py-0.5 font-data text-[10px] text-ink-dim hover:border-signal hover:text-signal"
                        >
                          {s.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 text-ink-faint">
                  {lead.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-xs text-ink-faint hover:text-ink"
                    >
                      Edit
                    </Link>
                    <DeleteLeadButton leadId={lead.id} companyName={lead.companyName} />
                  </div>
                </td>
              </tr>
            ))}

            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-ink-faint">
                  No leads yet.{" "}
                  <Link href="/admin/leads/new" className="text-signal hover:underline">
                    Add your first one
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
