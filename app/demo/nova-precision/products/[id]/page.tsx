import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExhibitionNav from "../../ExhibitionNav";
import ExhibitionFooter from "../../ExhibitionFooter";
import { products } from "@/app/lib/novaPrecision";
import styles from "../../exhibition.module.css";

const base = "/demo/nova-precision";

type Params = { id: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  return { title: product ? `${product.name} — NovaPrecision` : "Product" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
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
                href={`mailto:sales@example.com?subject=${encodeURIComponent(
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
      <ExhibitionFooter />
    </>
  );
}
