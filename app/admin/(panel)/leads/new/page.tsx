import LeadForm from "../../../components/LeadForm";

export default function NewLeadPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Add lead
      </h1>
      <p className="mt-1 text-sm text-ink-dim">
        Add a company to track as a potential exhibitor.
      </p>
      <div className="mt-8">
        <LeadForm />
      </div>
    </div>
  );
}
