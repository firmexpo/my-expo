import { prisma } from "@/app/lib/prisma";
import { csvResponse, toCsv } from "@/app/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = ["Name", "Email", "Phone", "Industry", "Created At"];
  const rows = subscribers.map((s) => [
    s.name,
    s.email,
    s.phone ?? "",
    s.industry,
    s.createdAt.toISOString(),
  ]);

  const csv = toCsv(headers, rows);
  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`firm-expo-subscribers-${date}.csv`, csv);
}
