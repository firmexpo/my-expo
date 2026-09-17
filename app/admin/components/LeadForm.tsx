"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  SOCIAL_PLATFORMS,
} from "@/app/lib/validation";

type SocialRow = { platform: string; url: string };

export type LeadFormValues = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  status: (typeof LEAD_STATUSES)[number];
  notes: string;
  socials: SocialRow[];
};

const EMPTY: LeadFormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  industry: "",
  status: "NEW",
  notes: "",
  socials: [],
};

type FieldErrors = Partial<Record<keyof LeadFormValues, string>>;

export default function LeadForm({
  leadId,
  initialValues,
}: {
  leadId?: number;
  initialValues?: LeadFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<LeadFormValues>(initialValues ?? EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [socialErrors, setSocialErrors] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function update<K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function addSocial() {
    setValues((v) => ({
      ...v,
      socials: [...v.socials, { platform: "Website", url: "" }],
    }));
  }

  function updateSocial(index: number, field: keyof SocialRow, value: string) {
    setValues((v) => ({
      ...v,
      socials: v.socials.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
    setSocialErrors((e) => ({ ...e, [index]: "" }));
  }

  function removeSocial(index: number) {
    setValues((v) => ({ ...v, socials: v.socials.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSocialErrors({});
    setNotice("");

    const url = leadId ? `/api/admin/leads/${leadId}` : "/api/admin/leads";
    const method = leadId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setNotice(data.message ?? "Something went wrong.");
        setSaving(false);
        return;
      }

      router.push("/admin/leads");
      router.refresh();
    } catch {
      setNotice("Couldn't reach the server. Please try again.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-line bg-bg-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-signal";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Company name</label>
          <input
            value={values.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={inputClass}
            placeholder="Acme Robotics"
          />
          {errors.companyName && <p className="mt-1 text-xs text-signal">{errors.companyName}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Contact name</label>
          <input
            value={values.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
          {errors.contactName && <p className="mt-1 text-xs text-signal">{errors.contactName}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Email</label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            placeholder="contact@acme.com"
          />
          {errors.email && <p className="mt-1 text-xs text-signal">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Phone</label>
          <input
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
          {errors.phone && <p className="mt-1 text-xs text-signal">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Industry</label>
          <input
            value={values.industry}
            onChange={(e) => update("industry", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
          {errors.industry && <p className="mt-1 text-xs text-signal">{errors.industry}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Status</label>
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value as LeadFormValues["status"])}
            className={inputClass}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs text-ink-dim">Notes</label>
        <textarea
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Optional"
        />
        {errors.notes && <p className="mt-1 text-xs text-signal">{errors.notes}</p>}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label className="text-xs text-ink-dim">Social profiles</label>
          <button
            type="button"
            onClick={addSocial}
            className="font-data text-xs text-signal hover:underline"
          >
            + Add profile
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {values.socials.map((s, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={s.platform}
                onChange={(e) => updateSocial(i, "platform", e.target.value)}
                className="w-40 shrink-0 rounded-md border border-line bg-bg-panel px-3 py-2 text-sm text-ink"
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="flex-1">
                <input
                  value={s.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                  placeholder="https://…"
                  className="w-full rounded-md border border-line bg-bg-panel px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-signal"
                />
                {socialErrors[i] && <p className="mt-1 text-xs text-signal">{socialErrors[i]}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeSocial(i)}
                aria-label="Remove profile"
                className="shrink-0 rounded-md px-2 text-ink-faint hover:text-signal"
              >
                ✕
              </button>
            </div>
          ))}
          {values.socials.length === 0 && (
            <p className="text-xs text-ink-faint">No social profiles added yet.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal-soft disabled:opacity-60"
        >
          {saving ? "Saving…" : leadId ? "Save changes" : "Add lead"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/leads")}
          className="text-sm text-ink-faint hover:text-ink"
        >
          Cancel
        </button>
      </div>

      {notice && (
        <p role="alert" className="mt-4 text-sm text-signal">
          {notice}
        </p>
      )}
    </form>
  );
}
