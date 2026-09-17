import Link from "next/link";
import ImportLeadsForm from "../../../components/ImportLeadsForm";

export const dynamic = "force-dynamic";

export default function ImportLeadsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Import leads
          </h1>
          <p className="mt-1 text-sm text-ink-dim">
            Paste JSON in the standard lead format to create or update leads in bulk.
          </p>
        </div>
        <Link href="/admin/leads" className="text-sm text-ink-faint hover:text-ink">
          Back to leads
        </Link>
      </div>

      <div className="mt-8">
        <ImportLeadsForm />
      </div>

      <div className="mt-10 max-w-3xl rounded-lg border border-line px-4 py-3 text-xs text-ink-dim">
        <p>
          Matching is by email — if a lead with the same email already exists it&apos;s
          updated, otherwise a new one is created. Anything in the payload beyond the core
          fields (products/services, target market, digital presence, marketing opportunity,
          data quality, etc.) is kept as-is and shown under &quot;Enriched profile data&quot; on
          the lead&apos;s edit page.
        </p>
        <p className="mt-2">
          There are also two secret-key-authenticated endpoints for programmatic imports,
          separate from this admin page:{" "}
          <code className="font-data">POST /api/leads/import/company</code> (keyed on
          website) and <code className="font-data">POST /api/leads/import/contacts</code>{" "}
          (core members, linked by website or lead id). See the project README for request
          shapes and the required API keys.
        </p>
      </div>
    </div>
  );
}
