import { notFound } from "next/navigation";
import { demoCompanies, getCompany } from "@/app/lib/demoCompanies";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoCompanies.map((company) => ({ slug: company.slug }));
}

export default async function DemoCompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCompany(slug)) notFound();
  return <>{children}</>;
}
