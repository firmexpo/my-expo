"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/app/lib/validation";

const STATUS_STYLES: Record<string, string> = {
  NEW: "text-ink-dim border-line",
  CONTACTED: "text-amber border-amber/40",
  QUALIFIED: "text-signal border-signal/40",
  EXHIBITING: "text-beacon border-beacon/40",
  DECLINED: "text-ink-faint border-line",
};

export default function LeadStatusSelect({
  leadId,
  status,
}: {
  leadId: number;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className={`rounded-md border bg-bg-panel px-2.5 py-1.5 text-xs font-medium disabled:opacity-60 ${STATUS_STYLES[value] ?? "text-ink-dim border-line"}`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-bg-panel text-ink">
          {LEAD_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
