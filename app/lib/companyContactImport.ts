import type { CompanyImportInput, ContactImportInput } from "@/app/lib/validation";

function normalizeWebsite(url: string): string {
  let v = url.trim().toLowerCase();
  v = v.replace(/^https?:\/\//, "").replace(/^www\./, "");
  v = v.replace(/\/+$/, "");
  return v;
}

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
};

export type MappedCompany = {
  website: string;
  companyName: string;
  industry: string | null;
  notes: string | null;
  socials: { platform: string; url: string }[];
  profile: Record<string, unknown>;
};

export function mapCompanyImport(input: CompanyImportInput): MappedCompany {
  const socials: MappedCompany["socials"] = [];
  socials.push({ platform: "Website", url: input.website });
  if (input.social_profiles) {
    for (const [key, label] of Object.entries(SOCIAL_LABELS)) {
      const url = input.social_profiles[key as keyof typeof input.social_profiles];
      if (url) socials.push({ platform: label, url });
    }
  }

  return {
    website: normalizeWebsite(input.website),
    companyName: input.name,
    industry: input.industry || null,
    notes: input.description || null,
    socials,
    profile: {
      icon_url: input.icon_url || null,
      business_type: input.business_type || null,
      founded_year: input.founded_year ?? null,
      employee_range: input.employee_range || null,
      headquarters: input.headquarters ?? null,
      social_profiles: input.social_profiles ?? null,
    },
  };
}

export type MappedContact = {
  websiteKey: string | null;
  leadId: number | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  department: string | null;
  seniorityLevel: string | null;
  roleCategory: string | null;
  decisionMaker: boolean;
  workEmail: string | null;
  mobilePhone: string | null;
  officePhone: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  sourceUrl: string | null;
  verified: boolean;
  confidenceScore: number | null;
};

export function mapContactImport(
  input: ContactImportInput,
  fallback: { website?: string; leadId?: number | string }
): MappedContact {
  const websiteRaw = input.website || fallback.website;
  const leadIdRaw = input.lead_id ?? fallback.leadId;

  const confidence = input.verification?.confidence_score;
  const confidenceScore =
    confidence === undefined || confidence === ""
      ? null
      : Math.max(0, Math.min(100, Math.round(Number(confidence))));

  return {
    websiteKey: websiteRaw ? normalizeWebsite(String(websiteRaw)) : null,
    leadId: leadIdRaw !== undefined ? Number(leadIdRaw) : null,
    name: input.name || null,
    firstName: input.first_name || null,
    lastName: input.last_name || null,
    jobTitle: input.job_title || null,
    department: input.department || null,
    seniorityLevel: input.seniority_level || null,
    roleCategory: input.role_category || null,
    decisionMaker: Boolean(input.decision_maker),
    workEmail: input.contact_information?.work_email || null,
    mobilePhone: input.contact_information?.mobile_phone || null,
    officePhone: input.contact_information?.office_phone || null,
    linkedin: input.social_profiles?.linkedin || null,
    twitter: input.social_profiles?.twitter || null,
    facebook: input.social_profiles?.facebook || null,
    city: input.location?.city || null,
    state: input.location?.state || null,
    country: input.location?.country || null,
    sourceUrl: input.verification?.source_url || null,
    verified: Boolean(input.verification?.verified),
    confidenceScore,
  };
}
