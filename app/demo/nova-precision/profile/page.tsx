
import ExhibitionNav from "../ExhibitionNav";
import ExhibitionFooter from "../ExhibitionFooter";
import { company } from "@/app/lib/novaPrecision";
import styles from "../exhibition.module.css";

function VideoPanel({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  // Supply a valid YouTube/Vimeo embed URL or a hosted video URL.
  if (!url) {
    return (
      <div className={styles.videoPlaceholder}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
          <p>Video placeholder — add the company's approved video URL.</p>
        </div>
      </div>
    );
  }

  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/video/")) {
    return (
      <iframe
        className={styles.videoFrame}
        src={url}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <video className={styles.videoFrame} controls preload="metadata">
      <source src={url} />
      Your browser does not support embedded video.
    </video>
  );
}

export default function CompanyProfilePage() {
  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
        <section className={styles.pageHeading}>
          <span className={styles.eyebrow}>Company exhibition / Profile</span>
          <h1>{company.name}</h1>
          <p>{company.description}</p>
        </section>

        <section>
          <span className={styles.eyebrow}>Company identity film</span>
          <VideoPanel
            title="Meet the company"
            description="Introduce the company, its people, facilities, and manufacturing identity."
            url={company.identityVideo}
          />
        </section>

        <section style={{ marginTop: 60 }}>
          <span className={styles.eyebrow}>Company overview</span>
          <div className={styles.grid} style={{ marginTop: 20 }}>
            <article className={styles.card}>
              <div className={styles.cardBody}>
                <h2>Who we are</h2>
                <p>{company.description}</p>
              </div>
            </article>
            <article className={styles.card}>
              <div className={styles.cardBody}>
                <h2>Company details</h2>
                <p><strong>Country:</strong> {company.country}</p>
                <p><strong>Founded:</strong> {company.founded}</p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={company.website} target="_blank" rel="noreferrer">
                    {company.website}
                  </a>
                </p>
              </div>
            </article>
          </div>
        </section>

        <section style={{ marginTop: 60 }}>
          <span className={styles.eyebrow}>Innovation film</span>
          <h2>Ideas in action.</h2>
          <p>
            Demonstrate new technologies, engineering improvements, production
            methods, or product development.
          </p>
          <VideoPanel
            title="Innovation showcase"
            description="Present an approved innovation video or factory demonstration."
            url={company.innovationVideo}
          />
        </section>
      </main>
      <ExhibitionFooter />
    </>
  );
}
 