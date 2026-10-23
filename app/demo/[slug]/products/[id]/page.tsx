import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExhibitionNav from "../../ExhibitionNav";
import ExhibitionFooter from "../../ExhibitionFooter";
import { demoCompanies, getCompany } from "@/app/lib/demoCompanies";
import styles from "../../exhibition.module.css";

type Params = { slug: string; id: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return demoCompanies.flatMap((company) =>
    company.products.map((product) => ({ slug: company.slug, id: product.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  const entry = getCompany(slug);
  const product = entry?.products.find((item) => item.id === id);
  return {
    title: product && entry ? `${product.name} — ${entry.profile.name}` : "Product",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, id } = await params;
  const entry = getCompany(slug);
  if (!entry) notFound();

  const base = `/demo/${slug}`;
  const { products } = entry;
  const index = products.findIndex((item) => item.id === id);
  if (index < 0) notFound();

  const product = products[index];
  const next = products[(index + 1) % products.length];

  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
        <Link href={`${base}/products`} className={styles.backLink}>
          ← All products
        </Link>

        <section className={styles.detail}>
          <figure className={styles.detailMedia}>
            <img src={product.image} alt={product.name} />
            <figcaption>
              PLATE {String(index + 1).padStart(2, "0")} · {product.name}
            </figcaption>
          </figure>

          <div className={styles.detailInfo}>
            <span className={styles.eyebrow}>{product.category}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <blockquote className={styles.story}>{product.story}</blockquote>

            <h3 className={styles.listTitle}>Specifications</h3>
            <ul className={styles.specList}>
              {product.specifications.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>

            <div className={styles.actions}>
              <a
                className={styles.button}
                href={`mailto:${entry.enquiryEmail}?subject=${encodeURIComponent(
                  `Enquiry about ${product.name} via FirmExpo`,
                )}`}
              >
                Ask about this product <span>↗</span>
              </a>
              <Link className={styles.buttonGhost} href={`${base}/go-live`}>
                Talk to the team
              </Link>
            </div>
          </div>
        </section>

        <Link href={`${base}/products/${next.id}`} className={styles.nextUp}>
          <span>NEXT ON DISPLAY</span>
          <strong>{next.name}</strong>
          <span aria-hidden="true">→</span>
        </Link>
      </main>
      <ExhibitionFooter slug={slug} name={entry.profile.name} />
    </>
  );
}
