import { z } from "zod";

export const INDUSTRIES = [
  "Technology & Software",
  "Manufacturing & Industrial",
  "Healthcare & Life Sciences",
  "Finance & Fintech",
  "Energy & Sustainability",
  "Retail & Consumer Goods",
  "Education & Research",
  "Media & Creative",
  "Logistics & Transport",
  "Other",
] as const;

export const subscriberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "That name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(190, "That email is too long."),
  phone: z
    .string()
    .trim()
    .max(32, "That phone number is too long.")
    .regex(/^[0-9+()\-\s]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  industry: z.enum(INDUSTRIES, {
    message: "Please choose an industry.",
  }),
});

export type SubscriberInput = z.infer<typeof subscriberSchema>;

export const SOCIAL_PLATFORMS = [
  "Website",
  "LinkedIn",
  "X / Twitter",
  "Instagram",
  "Facebook",
  "YouTube",
  "GitHub",
  "Other",
] as const;

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "EXHIBITING",
  "DECLINED",
] as const;

export const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  EXHIBITING: "Exhibiting",
  DECLINED: "Declined",
};

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export const LEAD_PRIORITY_LABELS: Record<(typeof LEAD_PRIORITIES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const optionalTrimmed = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

// Accepts "", a date ("2026-09-17"), or a full ISO datetime. Anything else fails.
const optionalDateInput = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date.");

export const socialProfileSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS, { message: "Choose a platform." }),
  url: z
    .string()
    .trim()
    .min(1, "Enter a URL.")
    .max(300, "That URL is too long.")
    .refine((v) => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "Enter a full URL, including https://"),
});

export const leadSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Please enter a company name.")
    .max(160, "That name is too long."),
  contactName: optionalTrimmed(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(190, "That email is too long."),
  phone: z
    .string()
    .trim()
    .max(32, "That phone number is too long.")
    .regex(/^[0-9+()\-\s]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  website: optionalTrimmed(300),
  industry: optionalTrimmed(80),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  notes: optionalTrimmed(2000),
  leadSource: optionalTrimmed(120),
  leadOwner: optionalTrimmed(120),
  leadScore: z.coerce.number().int().min(0).max(100).default(0),
  priority: z.enum(LEAD_PRIORITIES).default("MEDIUM"),
  lastContactedAt: optionalDateInput,
  nextFollowUpAt: optionalDateInput,
  socials: z.array(socialProfileSchema).max(12, "That's a lot of profiles — trim it to 12 or fewer.").default([]),
});

export type LeadInput = z.infer<typeof leadSchema>;

// ---------------------------------------------------------------------------
// Standard lead-import JSON format (company / location / contact / etc.)
// This mirrors the universal CRM lead JSON structure: every field is
// optional except the two the app truly needs (company name + an email
// to key the record on), since real-world scraped/enriched data is messy.
// ---------------------------------------------------------------------------

const str = () => z.string().trim().optional().or(z.literal(""));
const looseArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).optional().default([]);

export const leadImportSchema = z.object({
  company: z.object({
    name: z.string().trim().min(1, "company.name is required."),
    icon_url: str(),
    website: str(),
    industry: str(),
    business_type: str(),
    description: str(),
    founded_year: z.union([z.string(), z.number()]).optional(),
    employee_range: str(),
    annual_revenue_range: str(),
  }),

  location: z
    .object({
      headquarters: z
        .object({
          address: str(),
          city: str(),
          state: str(),
          country: str(),
          postal_code: str(),
        })
        .partial()
        .optional(),
      service_locations: looseArray(z.string()),
    })
    .partial()
    .optional(),

  contact: z
    .object({
      phone: str(),
      email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
      contact_page: str(),
      social_media: z
        .object({
          linkedin: str(),
          facebook: str(),
          instagram: str(),
          twitter: str(),
        })
        .partial()
        .optional(),
    })
    .partial()
    .optional(),

  products_services: looseArray(
    z.object({ name: str(), category: str(), description: str() })
  ),

  target_market: z
    .object({
      customer_type: looseArray(z.string()),
      industries_served: looseArray(z.string()),
      customer_segments: looseArray(z.string()),
    })
    .partial()
    .optional(),

  key_people: looseArray(
    z.object({
      name: str(),
      designation: str(),
      email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
      linkedin: str(),
    })
  ),

  digital_presence: z
    .object({
      seo_status: str(),
      website_quality: str(),
      advertising_status: str(),
      technology_used: looseArray(z.string()),
    })
    .partial()
    .optional(),

  marketing_opportunity: z
    .object({
      potential_services: looseArray(z.string()),
      pain_points: looseArray(z.string()),
      growth_opportunities: looseArray(z.string()),
    })
    .partial()
    .optional(),

  lead_management: z
    .object({
      lead_source: str(),
      lead_status: str(),
      lead_owner: str(),
      lead_score: z.union([z.string(), z.number()]).optional(),
      priority: str(),
      last_contacted: str(),
      next_follow_up: str(),
    })
    .partial()
    .optional(),

  data_quality: z
    .object({
      verified: z.boolean().optional(),
      verification_source: str(),
      collected_date: str(),
      updated_date: str(),
    })
    .partial()
    .optional(),
});

export type LeadImportInput = z.infer<typeof leadImportSchema>;

// ---------------------------------------------------------------------------
// Company-only import (POST /api/leads/import/company)
// Matches the "company core" JSON shape — de-duped on `website`.
// ---------------------------------------------------------------------------

export const companyImportSchema = z.object({
  name: z.string().trim().min(1, "name is required."),
  icon_url: str(),
  website: z.string().trim().min(1, "website is required to identify the company."),
  industry: str(),
  business_type: str(),
  description: str(),
  founded_year: z.union([z.string(), z.number()]).optional(),
  employee_range: str(),
  headquarters: z
    .object({
      city: str(),
      state: str(),
      country: str(),
    })
    .partial()
    .optional(),
  social_profiles: z
    .object({
      linkedin: str(),
      twitter: str(),
      facebook: str(),
      instagram: str(),
    })
    .partial()
    .optional(),
});

export type CompanyImportInput = z.infer<typeof companyImportSchema>;

// ---------------------------------------------------------------------------
// Core-member / contact-only import (POST /api/leads/import/contacts)
// Each contact links back to a company via `website` or `lead_id`
// (either on the batch envelope or per-contact, per-contact wins).
// ---------------------------------------------------------------------------

export const contactImportSchema = z.object({
  website: str(),
  lead_id: z.union([z.string(), z.number()]).optional(),

  name: str(),
  first_name: str(),
  last_name: str(),
  job_title: str(),
  department: str(),
  seniority_level: str(),
  role_category: str(),
  decision_maker: z.boolean().optional(),
  contact_information: z
    .object({
      work_email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
      mobile_phone: str(),
      office_phone: str(),
    })
    .partial()
    .optional(),
  social_profiles: z
    .object({
      linkedin: str(),
      twitter: str(),
      facebook: str(),
    })
    .partial()
    .optional(),
  location: z
    .object({
      city: str(),
      state: str(),
      country: str(),
    })
    .partial()
    .optional(),
  verification: z
    .object({
      source_url: str(),
      verified: z.boolean().optional(),
      confidence_score: z.union([z.string(), z.number()]).optional(),
    })
    .partial()
    .optional(),
});

export type ContactImportInput = z.infer<typeof contactImportSchema>;

// Envelope-level fallback identifier only — validated separately from the
// individual contacts so one malformed contact in a batch can't wipe out
// the shared website/lead_id fallback for the rest of the batch.
export const contactsBatchMetaSchema = z.object({
  website: str(),
  lead_id: z.union([z.string(), z.number()]).optional(),
});

