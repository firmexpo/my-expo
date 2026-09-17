import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Subscribers
          </h1>
          <p className="mt-1 text-sm text-ink-dim">
            {subscribers.length} {subscribers.length === 1 ? "signup" : "signups"} from the homepage waitlist
          </p>
        </div>
        <a
          href="/api/admin/subscribers/export"
          className="rounded-md border border-line px-4 py-2 text-sm text-ink-dim transition-colors hover:border-signal hover:text-ink"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-ink-faint">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink">{s.name}</td>
                <td className="px-4 py-3 text-ink-dim">
                  <a href={`mailto:${s.email}`} className="hover:text-signal">
                    {s.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-ink-dim">{s.phone || "—"}</td>
                <td className="px-4 py-3 text-ink-dim">{s.industry}</td>
                <td className="px-4 py-3 text-ink-faint">
                  {s.createdAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}

            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-faint">
                  No signups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
