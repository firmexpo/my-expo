
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./exhibition.module.css";

const links = [
  { label: "Overview", href: "/demo/nova-precision" },
  { label: "Products", href: "/demo/nova-precision/products" },
  { label: "Company Profile", href: "/demo/nova-precision/profile" },
  { label: "Team", href: "/demo/nova-precision/team" },
  { label: "Dealerships", href: "/demo/nova-precision/dealerships" },
  { label: "Locations", href: "/demo/nova-precision/locations" },
  { label: "Go Live", href: "/demo/nova-precision/go-live" },

];

export default function ExhibitionNav() {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.demoNotice}>
        FICTIONAL COMPANY · DEMONSTRATION EXHIBITION
      </div>

      <header className={styles.header}>
        <Link href="/demo/nova-precision" className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <span>
            <strong>FirmExpo</strong>
            <small>Your business on display.</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Company exhibition">
          {links.map((link) => {
            const active =
              link.href === "/demo/nova-precision"
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
      </header>
    </>
  );
}
