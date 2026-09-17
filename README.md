This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Lead management & import

Leads live in the `Lead` model (`prisma/schema.prisma`), with CRM fields (source, owner,
score, priority, last contacted / next follow-up) as real columns and everything else from
the standard lead JSON (company profile, target market, digital presence, marketing
opportunity, data quality, etc.) kept in a `profile` JSON column. Core members / decision
makers live in their own `LeadContact` model, linked to a `Lead`.

There are three ways to get leads in:

1. **Admin UI, one at a time** — `/admin/leads/new`.
2. **Admin UI, bulk JSON** — `/admin/leads/import` (requires an admin session). Paste a
   single lead object, an array, or `{ "leads": [...] }` in the standard lead JSON format;
   matches existing leads by email.
3. **Secret-key API, for external pipelines** — two routes outside `/api/admin/*`, so they
   are **not** covered by the admin cookie session and are gated only by an API key. Set
   `LEAD_COMPANY_IMPORT_API_KEY` and `LEAD_CONTACTS_IMPORT_API_KEY` (see `.env.example`)
   and send either header: `x-api-key: <key>` or `Authorization: Bearer <key>`.

   - `POST /api/leads/import/company` — company-level data, de-duplicated on `website`.
     ```json
     {
       "name": "Acme Robotics",
       "website": "https://acme.com",
       "industry": "Manufacturing",
       "business_type": "B2B",
       "description": "Industrial automation.",
       "founded_year": 2014,
       "employee_range": "51-200",
       "headquarters": { "city": "Austin", "state": "TX", "country": "US" },
       "social_profiles": { "linkedin": "https://linkedin.com/company/acme" }
     }
     ```
     Accepts a bare array, or `{ "companies": [...] }`, for bulk import.

   - `POST /api/leads/import/contacts` — core members, linked to a lead created above via
     `website` (or `lead_id`), either once on the envelope or per-contact:
     ```json
     {
       "website": "acme.com",
       "contacts": [
         {
           "name": "Jane Doe",
           "job_title": "VP Marketing",
           "decision_maker": true,
           "contact_information": { "work_email": "jane@acme.com" },
           "verification": { "verified": true, "confidence_score": 90 }
         }
       ]
     }
     ```
     A contact needs a company it belongs to — import the company first. Contacts with a
     `work_email` are upserted on it; contacts without one are always inserted fresh.

   Both endpoints return `{ ok, summary: { total, created, updated, failed }, errors: [...] }`
   so a bad record in a batch doesn't fail the whole import.

After changing `prisma/schema.prisma`, run `npm run db:migrate` to apply it.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
