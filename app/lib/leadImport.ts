import { LEAD_STATUSES, LEAD_PRIORITIES, leadImportSchema, type LeadImportInput } from "@/app/lib/validation";

type LeadStatusValue = (typeof LEAD_STATUSES)[number];
type LeadPriorityValue = (typeof LEAD_PRIORITIES)[number];

/**
 * A single normalized "raw" record pulled out of whatever the caller posted.
 * `data` is still unvalidated at this point — validation happens per-record
 * so one bad record in a batch doesn't sink the whole import.
 */
export type RawImportRecord = { index: number; data: unknown };

/**
 * Accepts any of the shapes people reasonably send:
 *  - a single lead object
 *  - a bare array of lead objects
 *  - { leads: [...] }
 *  - { data: [...] }
 */
export function normalizeImportPayload(body: unknown): RawImportRecord[] {
  if (Array.isArray(body)) {
    return body.map((data, index) => ({ index, data }));
  }
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.leads)) {
      return obj.leads.map((data, index) => ({ index, data }));
    }
    if (Array.isArray(obj.data)) {
      return obj.data.map((data, index) => ({ index, data }));
    }
    return [{ index: 0, data: body }];
  }
  return [{ index: 0, data: body }];
}

const STATUS_MAP: Record<string, LeadStatusValue> = {
  new: "NEW",
  contacted: "CONTACTED",
  qualified: "QUALIFIED",
  exhibiting: "EXHIBITING",
  "closed won": "EXHIBITING",
  won: "EXHIBITING",
  declined: "DECLINED",
  lost: "DECLINED",
  "closed lost": "DECLINED",
};

function mapStatus(input: string | undefined): LeadStatusValue {
  if (!input) return "NEW";
  return STATUS_MAP[input.trim().toLowerCase()] ?? "NEW";
}

function mapPriority(input: string | undefined): LeadPriorityValue {
  const key = (input ?? "").trim().toUpperCase();
  return (LEAD_PRIORITIES as readonly string[]).includes(key)
    ? (key as LeadPriorityValue)
    : "MEDIUM";
}

function parseScore(input: string | number | undefined): number {
  if (input === undefined || input === "") return 0;
  const n = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function parseDate(input: string | undefined): Date | null {
  if (!input) return null;
  const t = Date.parse(input);
  return Number.isNaN(t) ? null : new Date(t);
}

const SOCIAL_PLATFORM_MAP: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
};

export type MappedLead = {
  companyName: string;
  contactName: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string | null;
  status: LeadStatusValue;
  notes: string | null;
  leadSource: string | null;
  leadOwner: string | null;
  leadScore: number;
  priority: LeadPriorityValue;
  lastContactedAt: Date | null;
  nextFollowUpAt: Date | null;
  profile: Record<string, unknown>;
  socials: { platform: string; url: string }[];
};

export class LeadImportValidationError extends Error {
  issues: string[];
  constructor(issues: string[]) {
    super(issues[0] ?? "Invalid lead record.");
    this.issues = issues;
  }
}

/** Validates one raw record against the standard schema and maps it onto our Lead model. */
export function parseAndMapLead(data: unknown): MappedLead {
  const parsed = leadImportSchema.safeParse(data);
  if (!parsed.success) {
    throw new LeadImportValidationError(
      parsed.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
    );
  }
  return mapImportToLead(parsed.data);
}

export function mapImportToLead(input: LeadImportInput): MappedLead {
  const primaryContact = input.key_people?.[0];

  const email = (input.contact?.email || primaryContact?.email || "").trim().toLowerCase();
  if (!email) {
    throw new LeadImportValidationError([
      "contact.email (or key_people[0].email) is required to import a lead.",
    ]);
  }

  const socials: MappedLead["socials"] = [];
  const socialMedia = input.contact?.social_media;
  if (socialMedia) {
    for (const [key, label] of Object.entries(SOCIAL_PLATFORM_MAP)) {
      const url = socialMedia[key as keyof typeof socialMedia];
      if (url) socials.push({ platform: label, url });
    }
  }
  if (input.company.website) {
    socials.push({ platform: "Website", url: input.company.website });
  } else if (input.contact?.contact_page) {
    socials.push({ platform: "Website", url: input.contact.contact_page });
  }
  if (primaryContact?.linkedin) {
    socials.push({ platform: "LinkedIn", url: primaryContact.linkedin });
  }

  const lm = input.lead_management;

  // Everything that doesn't have a dedicated column stays intact as the
  // record's enriched profile, so nothing the caller sent is thrown away.
  const profile: Record<string, unknown> = {
    company: input.company,
    location: input.location ?? null,
    contact: input.contact ?? null,
    products_services: input.products_services ?? [],
    target_market: input.target_market ?? null,
    key_people: input.key_people ?? [],
    digital_presence: input.digital_presence ?? null,
    marketing_opportunity: input.marketing_opportunity ?? null,
    data_quality: input.data_quality ?? null,
  };

  return {
    companyName: input.company.name,
    contactName: primaryContact?.name || null,
    email,
    phone: input.contact?.phone || null,
    website: input.company.website || null,
    industry: input.company.industry || null,
    status: mapStatus(lm?.lead_status),
    notes: input.company.description || null,
    leadSource: lm?.lead_source || null,
    leadOwner: lm?.lead_owner || null,
    leadScore: parseScore(lm?.lead_score),
    priority: mapPriority(lm?.priority),
    lastContactedAt: parseDate(lm?.last_contacted),
    nextFollowUpAt: parseDate(lm?.next_follow_up),
    profile,
    socials: dedupeSocials(socials),
  };
}

function dedupeSocials(rows: { platform: string; url: string }[]) {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = `${r.platform}:${r.url}`;
    if (!r.url || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
