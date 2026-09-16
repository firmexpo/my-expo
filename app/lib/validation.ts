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
