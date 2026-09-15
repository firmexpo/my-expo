import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>Firm Expo — a digital exposition platform.</p>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/about" className="hover:text-ink-dim">About</Link>
          <Link href="/exhibitors" className="hover:text-ink-dim">Exhibitors</Link>
          <Link href="/contact" className="hover:text-ink-dim">Contact</Link>
          <a href="mailto:firmexpocarnival@gmail.com" className="hover:text-ink-dim">
            firmexpocarnival@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
