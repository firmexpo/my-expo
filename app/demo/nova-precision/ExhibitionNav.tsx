"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./exhibition.module.css";

const base = "/demo/nova-precision";

const links = [
  { label: "Overview", href: base },
  { label: "Products", href: `${base}/products` },
  { label: "Company", href: `${base}/profile` },
  { label: "Team", href: `${base}/team` },
  { label: "Dealerships", href: `${base}/dealerships` },
  { label: "Locations", href: `${base}/locations` },
  { label: "Go Live", href: `${base}/go-live` },
];

export default function ExhibitionNav() {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.demoNotice}>
        Fictional company · Demonstration exhibition
      </div>

      <header className={styles.header}>
        <Link href={base} className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <span className={styles.brandWords}>
            <strong>FirmExpo</strong>
            <small>Your business on display.</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Company exhibition">
          {links.map((link) => {
            const active =
              link.href === base
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? styles.activeLink : ""}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/contact" className={styles.headerCta}>
          Exhibit with us <span aria-hidden="true">↗</span>
        </Link>
      </header>
    </>
  );
}
