
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./demo-directory.module.css";

type Exhibitor = {
  name: string;
  slug: string;
  industry: string;
  location: string;
  description: string;
  initials: string;
  featured?: boolean;
  demo?: boolean;
};

const exhibitors: Exhibitor[] = [
  {
    name: "NovaPrecision Manufacturing",
    slug: "/demo/nova-precision",
    industry: "Machinery & Equipment",
    location: "Demo exhibition",
    description:
      "Explore precision engineering, industrial machinery, product capabilities, and company information.",
    initials: "NP",
    featured: true,
    demo: true,
  },

  // Add each new exhibitor here.
  // Example:
  // {
  //   name: "Company Name",
  //   slug: "/demo/company-slug",
  //   industry: "Steel & Metals",
  //   location: "Germany",
  //   description: "Company introduction and product capabilities.",
  //   initials: "CN",
  // },
];

const industries = [
  "All industries",
  "Machinery & Equipment",
  "CNC & Precision Engineering",
  "Steel & Metals",
  "Medical Equipment",
  "Industrial Automation",
  "Electrical & Electronics",
];

export default function DemoDirectoryPage() {
  const [activeIndustry, setActiveIndustry] = useState("All industries");
  const [search, setSearch] = useState("");

  const visibleExhibitors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return exhibitors.filter((company) => {
      const matchesIndustry =
        activeIndustry === "All industries" ||
        company.industry === activeIndustry;

      const matchesSearch =
        !term ||
        company.name.toLowerCase().includes(term) ||
        company.industry.toLowerCase().includes(term) ||
        company.location.toLowerCase().includes(term) ||
        company.description.toLowerCase().includes(term);

      return matchesIndustry && matchesSearch;
    });
  }, [activeIndustry, search]);

  const groupedExhibitors = useMemo(() => {
    return visibleExhibitors.reduce<Record<string, Exhibitor[]>>(
      (groups, company) => {
        if (!groups[company.industry]) {
          groups[company.industry] = [];
        }

        groups[company.industry].push(company);
        return groups;
      },
      {}
    );
  }, [visibleExhibitors]);

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/demo" className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <span>
            <strong>FirmExpo</strong>
            <small>Your business on display.</small>
          </span>
        </Link>

        <nav className={styles.nav}>
          <a href="#industries">Industries</a>
          <a href="#exhibitors">Exhibitors</a>
          <Link href="/demo/nova-precision">Explore exhibition</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            THE DIGITAL EXHIBITION DIRECTORY
          </div>

          <h1>
            Discover businesses.
            <br />
            <span>Explore what they make.</span>
          </h1>

          <p className={styles.heroText}>
            Explore manufacturers, discover products, and get to know the
            companies behind industrial innovation — all in one exhibition
            space.
          </p>

          <a href="#exhibitors" className={styles.primaryButton}>
            Explore exhibitors <span aria-hidden="true">↘</span>
          </a>

          <div className={styles.heroNote}>
            <span className={styles.noteLine} />
            A new way to experience business exhibitions.
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Industrial exhibition">
          <div className={styles.visualTop}>
            <span>FIRMEXPO / DIRECTORY</span>
            <span>INDUSTRY INDEX 001</span>
          </div>

          <div className={styles.visualGrid}>
            <div className={styles.visualOrb}>
              <span className={styles.orbRing} />
              <span className={styles.orbCore}>FX</span>
            </div>
            <div className={styles.visualCaption}>
              <span>INDUSTRY</span>
              <strong>MEETS OPPORTUNITY.</strong>
            </div>
          </div>

          <div className={styles.visualBottom}>
            <span>COMPANIES</span>
            <span>PRODUCTS</span>
            <span>CAPABILITIES</span>
          </div>
        </div>
      </section>

      <section className={styles.directory} id="industries">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionKicker}>EXPLORE THE DIRECTORY</span>
            <h2>Find your industry.</h2>
            <p>Start with a sector or search for a company.</p>
          </div>

          <div className={styles.resultCount}>
            <strong>{visibleExhibitors.length.toString().padStart(2, "0")}</strong>
            <span>EXHIBITORS</span>
          </div>
        </div>

        <div className={styles.filterPanel}>
          <div className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              aria-label="Search companies or industries"
              placeholder="Search companies, industries..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>/</kbd>
          </div>

          <div className={styles.filterLabel}>BROWSE BY INDUSTRY</div>

          <div className={styles.industryFilters}>
            {industries.map((industry) => (
              <button
                type="button"
                key={industry}
                onClick={() => setActiveIndustry(industry)}
                className={`${styles.filterButton} ${activeIndustry === industry ? styles.filterActive : ""
                  }`}
                aria-pressed={activeIndustry === industry}
              >
                {industry}
                {activeIndustry === industry && (
                  <span aria-hidden="true"> ↗</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.exhibitors} id="exhibitors">
          {Object.entries(groupedExhibitors).map(([industry, companies]) => (
            <section className={styles.industrySection} key={industry}>
              <div className={styles.industryHeading}>
                <div>
                  <span className={styles.sectionKicker}>INDUSTRY / SECTOR</span>
                  <h3>{industry}</h3>
                </div>
                <span className={styles.industryCount}>
                  {companies.length.toString().padStart(2, "0")}{" "}
                  {companies.length === 1 ? "EXHIBITOR" : "EXHIBITORS"}
                </span>
              </div>

              <div className={styles.companyGrid}>
                {companies.map((company, index) => (
                  <Link
                    href={company.slug}
                    key={company.slug}
                    className={styles.companyCard}
                    aria-label={`Open ${company.name} exhibition`}
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.companyIndex}>
                        EXH. {String(index + 1).padStart(3, "0")}
                      </span>
                      {company.featured && (
                        <span className={styles.featuredTag}>FEATURED</span>
                      )}
                    </div>

                    <div className={styles.companyIdentity}>
                      <div className={styles.companyMark}>
                        {company.initials}
                      </div>
                      <span className={styles.cardArrow} aria-hidden="true">
                        ↗
                      </span>
                    </div>

                    <div className={styles.companyInfo}>
                      <span className={styles.companyIndustry}>
                        {company.industry}
                      </span>
                      <h4>{company.name}</h4>
                      <p>{company.description}</p>
                    </div>

                    <div className={styles.cardFooter}>
                      <span>{company.location}</span>
                      <strong>ENTER EXHIBITION →</strong>
                    </div>

                    {company.demo && (
                      <div className={styles.demoNotice}>
                        DEMO EXHIBITOR · SAMPLE CONTENT
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {visibleExhibitors.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⌕</div>
              <h3>No exhibitors found.</h3>
              <p>
                Try another search term or select a different industry.
              </p>
              <button
                type="button"
                className={styles.resetButton}
                onClick={() => {
                  setSearch("");
                  setActiveIndustry("All industries");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.invitation}>
        <div>
          <span className={styles.sectionKicker}>YOUR COMPANY, NEXT</span>
          <h2>Give your business a place on the exhibition floor.</h2>
          <p>
            Showcase your company, products, capabilities, and innovation on
            FirmExpo.
          </p>
        </div>
        <a href="https://firmexpo.com" className={styles.invitationButton}>
          Discover FirmExpo <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className={styles.footer}>
        <Link href="/demo" className={styles.footerBrand}>
          FirmExpo<span>®</span>
        </Link>
        <p>Your business on display.</p>
        <span>EXHIBITION DIRECTORY / DEMO</span>
      </footer>
    </main>
  );
}
