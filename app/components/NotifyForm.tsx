"use client";

import { useState } from "react";
import { INDUSTRIES } from "@/app/lib/validation";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "industry", string>>;

const EMPTY = { name: "", email: "", phone: "", industry: "" };

export default function NotifyForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [notice, setNotice] = useState("");

  function update(field: keyof typeof EMPTY, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    setNotice("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setNotice(data.message ?? "Something went wrong.");
        setStatus("idle");
        return;
      }

      setNotice(data.message);
      setStatus("done");
      setValues(EMPTY);
    } catch {
      setNotice("Couldn't reach the server. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="max-w-md rounded-md border border-signal/40 bg-bg-panel p-6">
        <p className="font-display text-lg text-ink">You&apos;re on the list.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">{notice}</p>
        <button
          onClick={() => {
            setStatus("idle");
            setNotice("");
          }}
          className="mt-4 font-data text-xs text-signal hover:underline"
        >
          Add another person
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-md border border-line bg-bg-panel px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="sr-only">Full name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Full name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="mt-1 text-xs text-signal">{errors.name}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1 text-xs text-signal">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="sr-only">Phone number (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone (optional)"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="mt-1 text-xs text-signal">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="industry" className="sr-only">Interested industry</label>
          <select
            id="industry"
            name="industry"
            value={values.industry}
            onChange={(e) => update("industry", e.target.value)}
            className={`${inputClass} ${values.industry ? "text-ink" : "text-ink-faint"}`}
            aria-invalid={!!errors.industry}
          >
            <option value="">Industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i} className="bg-bg-panel text-ink">
                {i}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1 text-xs text-signal">{errors.industry}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-full rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-soft disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Saving…" : "Keep me updated"}
      </button>

      {notice && (
        <p role="alert" className="mt-3 text-xs text-signal">
          {notice}
        </p>
      )}
    </form>
  );
}
