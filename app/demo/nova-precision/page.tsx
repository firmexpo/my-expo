
import Link from "next/link";
import ExhibitionNav from "./ExhibitionNav";
import ExhibitionFooter from "./ExhibitionFooter";
import { products, team, dealerships, locations } from "@/app/lib/novaPrecision";
import styles from "./page.module.css";

const base = "/demo/nova-precision";

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
    <>
      <ExhibitionNav />
      <main className={styles.page}>
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
            <strong>Made with care, measured to the micron.</strong>
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
            Step inside NovaPrecision Manufacturing — the hands, the machines and
            the quiet pride behind every part, gathered in one digital
            exhibition.
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
            Behind every machine,
            <br />
            <span>a person who cared.</span>
          </h2>
        </div>

        <div className={styles.introCopy}>
          <p>
            A good exhibition shows buyers not only what a manufacturer makes,
            but who makes it — the engineers who stay late to get a tolerance
            right, and the people who pick up the phone when something
            matters.
          </p>
          <Link href={`${base}/profile`} className={styles.textLink}>
            Explore company profile <span>→</span>
          </Link>
        </div>
      </section>

      <section className={styles.letterSection}>
        <figure className={styles.letter}>
          <span className={styles.letterMark} aria-hidden="true">“</span>
          <blockquote className={styles.letterBody}>
            We began with one lathe, a rented garage and a promise: every part
            that leaves our door is one we would proudly sign. Decades later,
            that promise is still the only thing we really sell.
          </blockquote>
          <figcaption className={styles.letterSign}>
            <span>Alex Morgan</span>
            Managing Director · a letter from the workshop (fictional)
          </figcaption>
        </figure>
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
            <article className={styles.teamCard} key={person.id}>
              <div className={styles.avatar}>
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <span className={styles.teamIndex}>TEAM MEMBER / 0{index + 1}</span>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <blockquote className={styles.teamNote}>{person.note}</blockquote>
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
              <div className={styles.networkRow} key={dealer.id}>
                <div>
                  <strong>{dealer.name}</strong>
                  <span>
                    {dealer.products.join(" · ")} — {dealer.country}
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
              <div className={styles.networkRow} key={location.id}>
                <div>
                  <strong>{location.name}</strong>
                  <span>{location.type} · {location.country}</span>
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
            Let the world meet
            <br />
            the people behind your name.
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

    </main>
      <ExhibitionFooter />
    </>
  );
}
