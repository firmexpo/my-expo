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

const optionalTrimmed = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

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
  industry: optionalTrimmed(80),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  notes: optionalTrimmed(2000),
  socials: z.array(socialProfileSchema).max(12, "That's a lot of profiles — trim it to 12 or fewer.").default([]),
});

export type LeadInput = z.infer<typeof leadSchema>;

