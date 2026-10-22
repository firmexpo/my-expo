
import ExhibitionNav from "../ExhibitionNav";
import ExhibitionFooter from "../ExhibitionFooter";
import { team } from "@/app/lib/novaPrecision";
import styles from "../exhibition.module.css";

export default function TeamPage() {
  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
        <div className={styles.pageHeading}>
          <span className={styles.eyebrow}>People / Business contacts</span>
          <h1>Meet the people behind the business.</h1>
          <p>
            Introduce company leadership, sales representatives, engineering
            specialists, and regional business contacts.
          </p>
        </div>

        <div className={styles.grid}>
          {team.map((person) => (
            <article className={styles.card} key={person.id}>
              {person.image ? (
                <img
                  className={styles.cardImage}
                  src={person.image}
                  alt={person.name}
                />
              ) : (
                <div className={styles.portrait} aria-hidden="true">
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
              )}

              <div className={styles.cardBody}>
                <span className={styles.meta}>{person.role}</span>
                <h2>{person.name}</h2>
                <p>{person.bio}</p>
                {person.note && (
                  <blockquote className={styles.story}>{person.note}</blockquote>
                )}

                <p>
                  <a href={`mailto:${person.email}`}>{person.email}</a>
                </p>
                <p>
                  <a href={`tel:${person.phone}`}>{person.phone}</a>
                </p>
                <a
                  className={styles.button}
                  href={`mailto:${person.email}?subject=${encodeURIComponent(
                    "Business enquiry via FirmExpo"
                  )}`}
                >
                  Contact this person ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.fineprint}>
          Demo data: replace these fictional profiles with company-approved
          names, photographs, job titles, and business contact details.
        </p>
      </main>
      <ExhibitionFooter />
    </>
  );
}
