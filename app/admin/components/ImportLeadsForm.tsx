"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ImportResult = {
  ok: boolean;
  message?: string;
  summary?: { total: number; created: number; updated: number; failed: number };
  errors?: { index: number; company?: string; message: string }[];
};

const PLACEHOLDER = `{
  "company": { "name": "Acme Robotics", "industry": "Manufacturing" },
  "contact": { "email": "hello@acme.com" },
  "lead_management": { "lead_source": "Trade show", "lead_status": "New" }
}`;

export default function ImportLeadsForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState("");

  async function handleFile(file: File) {
    const contents = await file.text();
    setText(contents);
    setParseError("");
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParseError("");
    setResult(null);

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      setParseError("That's not valid JSON. Check for a trailing comma or unmatched bracket.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: ImportResult = await res.json();
      setResult(data);
      if (res.ok && data.summary && data.summary.created + data.summary.updated > 0) {
        router.refresh();
      }
    } catch {
      setResult({ ok: false, message: "Couldn't reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <label className="text-xs text-ink-dim">
            Paste a single lead object, an array of leads, or {"{ \"leads\": [...] }"}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-data text-xs text-signal hover:underline"
            >
              Upload .json file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setParseError("");
          }}
          rows={16}
          spellCheck={false}
          placeholder={PLACEHOLDER}
          className="mt-2 w-full rounded-md border border-line bg-bg-panel px-4 py-3 font-data text-xs text-ink placeholder:text-ink-faint focus:border-signal"
        />
        {parseError && <p className="mt-1 text-xs text-signal">{parseError}</p>}

        <div className="mt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal-soft disabled:opacity-60"
          >
            {submitting ? "Importing…" : "Import leads"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/leads")}
            className="text-sm text-ink-faint hover:text-ink"
          >
            Back to leads
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 rounded-lg border border-line p-4">
          {!result.ok && (
            <p className="text-sm text-signal">{result.message ?? "Import failed."}</p>
          )}

          {result.ok && result.summary && (
            <div>
              <p className="text-sm text-ink">
                {result.summary.created} created · {result.summary.updated} updated
                {result.summary.failed > 0 ? ` · ${result.summary.failed} failed` : ""}{" "}
                <span className="text-ink-faint">of {result.summary.total} record(s)</span>
              </p>

              {result.errors && result.errors.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
                  {result.errors.map((err, i) => (
                    <li key={i} className="font-data text-xs text-ink-dim">
                      <span className="text-signal">
                        #{err.index + 1}
                        {err.company ? ` (${err.company})` : ""}:
                      </span>{" "}
                      {err.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
