
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ExhibitionNav from "../ExhibitionNav";
import ExhibitionFooter from "../ExhibitionFooter";
import { products } from "@/app/lib/novaPrecision"; // from "@/lib/novaPrecision";
import styles from "../exhibition.module.css";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState("name");

  const categories = [
    "All categories",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const query = search.toLowerCase().trim();
        const matchesSearch =
          !query ||
          `${p.name} ${p.category} ${p.description}`
            .toLowerCase()
            .includes(query);

        return (
          matchesSearch &&
          (category === "All categories" || p.category === category)
        );
      })
      .sort((a, b) =>
        sort === "name" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
  }, [search, category, sort]);

  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
        <div className={styles.pageHeading}>
          <span className={styles.eyebrow}>Exhibition / Product catalogue</span>
          <h1>Products & equipment.</h1>
          <p>
            Explore the product range, compare categories, and open individual
            product pages to see specifications and supporting information.
          </p>
        </div>

        <div className={styles.toolbar}>
          <input
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, equipment, categories..."
            aria-label="Search products"
          />

          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="name">Name: A–Z</option>
            <option value="reverse">Name: Z–A</option>
          </select>
        </div>

        <p className={styles.count}>
          {String(filtered.length).padStart(2, "0")} on display
        </p>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            No products match those filters. Try another search or category.
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <article className={styles.card} key={product.id}>
                <Link
                  href={`/demo/nova-precision/products/${product.id}`}
                  aria-label={`View ${product.name}`}
                >
                  <img
                    className={styles.cardImage}
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </Link>
                <div className={styles.cardBody}>
                  <span className={styles.meta}>{product.category}</span>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <Link
                    className={styles.button}
                    href={`/demo/nova-precision/products/${product.id}`}
                  >
                    View product <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <ExhibitionFooter />
    </>
  );
}
