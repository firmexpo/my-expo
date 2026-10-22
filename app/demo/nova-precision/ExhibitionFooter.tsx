import Link from "next/link";
import styles from "./exhibition.module.css";

const base = "/demo/nova-precision";

export default function ExhibitionFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <span className={styles.brandWords}>
            <strong>FirmExpo</strong>
            <small>Your business on display.</small>
          </span>
        </Link>

        <p className={styles.footerNote}>
          Behind every business is a story worth telling — and people worth
          meeting.
        </p>

        <div className={styles.footerLinks}>
          <Link href={base}>Exhibition</Link>
          <Link href={`${base}/products`}>Products</Link>
          <Link href={`${base}/go-live`}>Go Live</Link>
          <Link href="/exhibitors">Exhibitors</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className={styles.footerBase}>
        <span>© {new Date().getFullYear()} FirmExpo</span>
        <span>NovaPrecision is a fictional company, shown for demonstration.</span>
      </div>
    </footer>
  );
}
