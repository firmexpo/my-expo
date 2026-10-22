
"use client";

import { useMemo, useState } from "react";
import ExhibitionNav from "../ExhibitionNav";
import ExhibitionFooter from "../ExhibitionFooter";
import { locations } from "@/app/lib/novaPrecision";
import styles from "../exhibition.module.css";

export default function LocationsPage() {
  const [type, setType] = useState("All locations");
  const [country, setCountry] = useState("All countries");
  const [search, setSearch] = useState("");

  const types = [
    "All locations",
    ...Array.from(new Set(locations.map((l) => l.type))),
  ];

  const countries = [
    "All countries",
    ...Array.from(new Set(locations.map((l) => l.country))),
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return locations.filter((location) => {
      const matchesType = type === "All locations" || location.type === type;
      const matchesCountry =
        country === "All countries" || location.country === country;

      const searchable =
        `${location.name} ${location.type} ${location.country} ${location.region} ${location.services.join(" ")}`.toLowerCase();

      return matchesType && matchesCountry && (!q || searchable.includes(q));
    });
  }, [type, country, search]);

  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
        <div className={styles.pageHeading}>
          <span className={styles.eyebrow}>Global network / Locations</span>
          <h1>Where we operate.</h1>
          <p>
            Explore manufacturing facilities, offices, warehouses, and
            technical support locations.
          </p>
        </div>

        <div className={styles.toolbar}>
          <input
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations or services..."
            aria-label="Search locations"
          />

          <select
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by location type"
          >
            {types.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Filter by country"
          >
            {countries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>No matching locations found.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((location) => (
              <article className={styles.card} key={location.id}>
                <div className={styles.cardBody}>
                  <span className={styles.meta}>{location.type}</span>
                  <h2>{location.name}</h2>
                  <p>
                    {location.region}, {location.country}
                  </p>
                  <p>{location.address}</p>

                  <h3>Available services</h3>
                  <ul className={styles.detailList}>
                    {location.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>

                  <a
                    className={styles.button}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on map ↗
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
