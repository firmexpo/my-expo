
"use client";

import { useMemo, useState } from "react";
import ExhibitionNav from "../ExhibitionNav";
import ExhibitionFooter from "../ExhibitionFooter";
import { dealerships } from "@/app/lib/novaPrecision";
import styles from "../exhibition.module.css";

export default function DealershipsPage() {
  const [country, setCountry] = useState("All countries");
  const [search, setSearch] = useState("");

  const countries = [
    "All countries",
    ...Array.from(new Set(dealerships.map((d) => d.country))),
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return dealerships.filter((dealer) => {
      const matchesCountry =
        country === "All countries" || dealer.country === country;

      const searchable =
        `${dealer.name} ${dealer.country} ${dealer.region} ${dealer.products.join(" ")}`.toLowerCase();

      return matchesCountry && (!q || searchable.includes(q));
    });
  }, [country, search]);

  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
        <div className={styles.pageHeading}>
          <span className={styles.eyebrow}>Sales network / Dealerships</span>
          <h1>Find a distributor.</h1>
          <p>
            Discover dealerships and distribution partners by country, region,
            or product range.
          </p>
        </div>

        <div className={styles.toolbar}>
          <input
            className={styles.input}
            placeholder="Search dealers, regions, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search dealerships"
          />

          <select
            className={styles.select}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Filter dealerships by country"
          >
            {countries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>No matching dealerships found.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((dealer) => (
              <article className={styles.card} key={dealer.id}>
                <div className={styles.cardBody}>
                  <span className={styles.meta}>{dealer.region}</span>
                  <h2>{dealer.name}</h2>
                  <p><strong>Country:</strong> {dealer.country}</p>
                  <p><strong>Address:</strong> {dealer.address}</p>
                  <h3>Products represented</h3>
                  <ul className={styles.detailList}>
                    {dealer.products.map((product) => (
                      <li key={product}>{product}</li>
                    ))}
                  </ul>
                  <a
                    className={styles.button}
                    href={`mailto:${dealer.email}?subject=${encodeURIComponent(
                      "Dealership enquiry via FirmExpo"
                    )}`}
                  >
                    Contact dealership ↗
                  </a>
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
