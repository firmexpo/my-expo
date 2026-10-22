
import Link from "next/link";
import styles from "./page.module.css";

const base = "/demo/nova-precision";

const products = [
  {
    id: "cnc-machining-center",
    name: "CNC Machining Center",
    category: "CNC Machinery",
    description: "Precision machining for demanding industrial applications.",
    image:
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "industrial-lathe",
    name: "Industrial Turning System",
    category: "Turning Equipment",
    description: "Designed for consistent turning and production workflows.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "automation-cell",
    name: "Automation Cell",
    category: "Automation",
    description: "An integrated approach to repeatable manufacturing tasks.",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=85",
  },
];

const team = [
  {
    name: "Alex Morgan",
    role: "Managing Director",
    email: "alex@example.com",
  },
  {
    name: "Jordan Lee",
    role: "Sales & Partnerships",
    email: "sales@example.com",
  },
  {
    name: "Taylor Reed",
    role: "Engineering Lead",
    email: "engineering@example.com",
  },
];

const dealerships = [
  {
    name: "Northern Industrial Partners",
    region: "Northern Region",
    country: "Germany",
    specialty: "Machinery distribution",
  },
  {
    name: "Central Equipment Network",
    region: "Central Region",
    country: "Germany",
    specialty: "Equipment sales and support",
  },
];

const locations = [
  {
    name: "Manufacturing Facility",
    type: "Factory",
    address: "Demo address — replace before publishing",
  },
  {
    name: "Sales & Service Office",
    type: "Office",
    address: "Demo address — replace before publishing",
  },
];

const capabilities = [
  "Precision CNC machining",
  "Industrial equipment",
  "Production engineering",
  "Automation integration",
  "Technical support",
  "Custom manufacturing",
];

export default function NovaPrecisionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.demoBanner}>
        <span className={styles.demoDot} />
        INTERACTIVE DEMO · FICTIONAL COMPANY PROFILE
      </div>

      <header className={styles.header}>
        <Link href={base} className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <span>
            <strong>FirmExpo</strong>
            <small>Your business on display.</small>
          </span>
        </Link>

        <nav className={styles.nav}>
          <Link href={base}>Overview</Link>
          <Link href={`${base}/products`}>Products</Link>
          <Link href={`${base}/profile`}>Company</Link>
          <Link href={`${base}/team`}>Team</Link>
          <Link href={`${base}/dealerships`}>Dealerships</Link>
          <Link href={`${base}/locations`}>Locations</Link>
          <Link href={`${base}/go-live`}>Go Live</Link>
        </nav>

        <Link href="/contact" className={styles.headerCta}>
          Contact FirmExpo <span>↗</span>
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroVisual}>
          <img
            src="https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1800&q=90"
            alt="Industrial manufacturing machinery"
          />
          <div className={styles.imageShade} />

          <div className={styles.heroImageLabel}>
            <span className={styles.liveDot} />
            DIGITAL EXHIBITION
          </div>

          <div className={styles.heroImageCaption}>
            <span>ENGINEERING · TECHNOLOGY · PRODUCTION</span>
            <strong>Built for precision.</strong>
          </div>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span /> MANUFACTURING & INDUSTRIAL TECHNOLOGY
          </p>

          <h1>
            Meet the company
            <br />
            behind the <span>machines.</span>
          </h1>

          <p className={styles.heroDescription}>
            Explore the people, products, capabilities and innovations behind
            NovaPrecision Manufacturing — presented in one digital exhibition.
          </p>

          <div className={styles.heroActions}>
            <Link href={`${base}/products`} className={styles.primaryButton}>
              Explore products <span>↗</span>
            </Link>
            <Link href={`${base}/profile`} className={styles.secondaryButton}>
              Discover the company
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div>
              <strong>{String(products.length).padStart(2, "0")}</strong>
              <span>Featured products</span>
            </div>
            <div>
              <strong>{String(capabilities.length).padStart(2, "0")}</strong>
              <span>Capabilities</span>
            </div>
            <div>
              <strong>{String(team.length).padStart(2, "0")}</strong>
              <span>Team profiles</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.trustStrip}>
        <span>PRECISION ENGINEERING</span>
        <i />
        <span>INDUSTRIAL SOLUTIONS</span>
        <i />
        <span>MANUFACTURING TECHNOLOGY</span>
        <i />
        <span>GLOBAL PARTNERSHIPS</span>
      </div>

      <section className={styles.introSection}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>01 / COMPANY OVERVIEW</p>
          <h2>
            More than a machine.
            <br />
            <span>A complete capability.</span>
          </h2>
        </div>

        <div className={styles.introCopy}>
          <p>
            A company exhibition should help buyers understand not only what a
            manufacturer makes, but how its people, engineering expertise and
            production capabilities work together.
          </p>
          <Link href={`${base}/profile`} className={styles.textLink}>
            Explore company profile <span>→</span>
          </Link>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.sectionLabel}>02 / PRODUCT SHOWCASE</p>
            <h2>Explore the equipment.</h2>
          </div>
          <Link href={`${base}/products`} className={styles.textLink}>
            View all products <span>↗</span>
          </Link>
        </div>

        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <Link
              href={`${base}/products/${product.id}`}
              className={styles.productCard}
              key={product.id}
            >
              <div className={styles.productImageWrap}>
                <img src={product.image} alt={product.name} />
                <span className={styles.productNumber}>
                  0{index + 1}
                </span>
                <span className={styles.productArrow}>↗</span>
              </div>

              <div className={styles.productInfo}>
                <span className={styles.productCategory}>
                  {product.category}
                </span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className={styles.cardLink}>
                  View product details <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className={styles.videoCopy}>
          <p className={styles.sectionLabel}>03 / COMPANY IDENTITY</p>
          <h2>
            Put your story
            <br />
            <span>in motion.</span>
          </h2>
          <p>
            Give visitors a closer look at your factory, engineering team,
            production environment and the thinking behind your business.
          </p>
          <Link href={`${base}/profile`} className={styles.primaryButton}>
            Explore company profile <span>↗</span>
          </Link>
        </div>

        <div className={styles.videoPlaceholder}>
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85"
            alt="Industrial engineering environment"
          />
          <div className={styles.videoOverlay}>
            <span className={styles.playIcon}>▶</span>
            <strong>Company identity film</strong>
            <small>Replace this preview with the company video</small>
          </div>
          <span className={styles.videoTag}>VIDEO FEATURE</span>
        </div>
      </section>

      <section className={styles.capabilitiesSection}>
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.sectionLabel}>04 / WHAT WE DO</p>
            <h2>Capabilities at a glance.</h2>
          </div>
          <Link href={`${base}/profile`} className={styles.textLink}>
            Company capabilities <span>↗</span>
          </Link>
        </div>

        <div className={styles.capabilityGrid}>
          {capabilities.map((item, index) => (
            <div className={styles.capabilityItem} key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <span className={styles.capabilityArrow}>↗</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.innovationSection}>
        <div className={styles.innovationImage}>
          <img
            src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=85"
            alt="Industrial research and engineering"
          />
          <span className={styles.imageCornerLabel}>INNOVATION / 01</span>
        </div>

        <div className={styles.innovationCopy}>
          <p className={styles.sectionLabel}>05 / ENGINEERING INNOVATION</p>
          <h2>
            Show the thinking
            <br />
            <span>behind the product.</span>
          </h2>
          <p>
            Feature product development, technical demonstrations, new
            manufacturing methods and engineering breakthroughs in a dedicated
            innovation showcase.
          </p>
          <Link href={`${base}/profile`} className={styles.textLink}>
            Discover innovation <span>↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.sectionsSection}>
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.sectionLabel}>06 / EXPLORE THE EXHIBITION</p>
            <h2>Every business connection, in one place.</h2>
          </div>
        </div>

        <div className={styles.exhibitionGrid}>
          <Link href={`${base}/profile`} className={styles.exhibitionCard}>
            <span className={styles.exhibitionIndex}>01</span>
            <span className={styles.exhibitionIcon}>⌂</span>
            <h3>Company profile</h3>
            <p>Identity, story, expertise and innovation.</p>
            <span className={styles.exhibitionArrow}>↗</span>
          </Link>

          <Link href={`${base}/team`} className={styles.exhibitionCard}>
            <span className={styles.exhibitionIndex}>02</span>
            <span className={styles.exhibitionIcon}>◎</span>
            <h3>People & contacts</h3>
            <p>Discover the people behind the business.</p>
            <span className={styles.exhibitionArrow}>↗</span>
          </Link>

          <Link
            href={`${base}/dealerships`}
            className={styles.exhibitionCard}
          >
            <span className={styles.exhibitionIndex}>03</span>
            <span className={styles.exhibitionIcon}>⇄</span>
            <h3>Dealership network</h3>
            <p>Explore distribution and business partners.</p>
            <span className={styles.exhibitionArrow}>↗</span>
          </Link>

          <Link href={`${base}/locations`} className={styles.exhibitionCard}>
            <span className={styles.exhibitionIndex}>04</span>
            <span className={styles.exhibitionIcon}>⌖</span>
            <h3>Locations</h3>
            <p>Find facilities, offices and service points.</p>
            <span className={styles.exhibitionArrow}>↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.sectionLabel}>07 / THE PEOPLE</p>
            <h2>Meet the team behind the work.</h2>
          </div>
          <Link href={`${base}/team`} className={styles.textLink}>
            Meet the full team <span>↗</span>
          </Link>
        </div>

        <div className={styles.teamGrid}>
          {team.map((person, index) => (
            <article className={styles.teamCard} key={person.email}>
              <div className={styles.avatar}>
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <span className={styles.teamIndex}>TEAM MEMBER / 0{index + 1}</span>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <a href={`mailto:${person.email}`}>Contact member ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.networkSection}>
        <div className={styles.networkHeader}>
          <div>
            <p className={styles.sectionLabel}>08 / BUSINESS NETWORK</p>
            <h2>Connections beyond the factory.</h2>
          </div>
          <p>
            Help buyers find the right regional partner, sales contact or
            service location.
          </p>
        </div>

        <div className={styles.networkGrid}>
          <div className={styles.networkPanel}>
            <span className={styles.panelNumber}>01 / DISTRIBUTION</span>
            <h3>Dealerships & partners</h3>
            {dealerships.map((dealer) => (
              <div className={styles.networkRow} key={dealer.name}>
                <div>
                  <strong>{dealer.name}</strong>
                  <span>
                    {dealer.region} · {dealer.country}
                  </span>
                </div>
                <span>↗</span>
              </div>
            ))}
            <Link href={`${base}/dealerships`} className={styles.textLink}>
              Explore dealer network →
            </Link>
          </div>

          <div className={styles.networkPanel}>
            <span className={styles.panelNumber}>02 / GLOBAL PRESENCE</span>
            <h3>Facilities & locations</h3>
            {locations.map((location) => (
              <div className={styles.networkRow} key={location.name}>
                <div>
                  <strong>{location.name}</strong>
                  <span>{location.type}</span>
                </div>
                <span>↗</span>
              </div>
            ))}
            <Link href={`${base}/locations`} className={styles.textLink}>
              Explore locations →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p className={styles.sectionLabel}>YOUR BUSINESS, ON DISPLAY</p>
          <h2>
            Your company deserves
            <br />
            a better stage.
          </h2>
          <p>
            FirmExpo brings your products, people, capabilities and innovation
            together in one digital exhibition.
          </p>
        </div>

        <Link href="/contact" className={styles.ctaButton}>
          Exhibit on FirmExpo <span>↗</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <span>
            <strong>FirmExpo</strong>
            <small>Your business on display.</small>
          </span>
        </Link>

        <p>A digital exhibition stage for production businesses.</p>

        <div className={styles.footerLinks}>
          <Link href="/">FirmExpo home</Link>
          <Link href="/about">About</Link>
          <Link href="/exhibitors">Exhibitors</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <span className={styles.copyright}>
          © {new Date().getFullYear()} FirmExpo
        </span>
      </footer>
    </main>
  );
}
