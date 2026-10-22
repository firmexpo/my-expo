
import ExhibitionNav from "../ExhibitionNav";
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
                <div className={styles.videoPlaceholder}>
                  <span>Team profile photo</span>
                </div>
              )}

              <div className={styles.cardBody}>
                <span className={styles.meta}>{person.role}</span>
                <h2>{person.name}</h2>
                <p>{person.bio}</p>

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

        <p style={{ marginTop: 30, color: "#687481", fontSize: 12 }}>
          Demo data: replace these fictional profiles with company-approved
          names, photographs, job titles, and business contact details.
        </p>
      </main>
    </>
  );
}
