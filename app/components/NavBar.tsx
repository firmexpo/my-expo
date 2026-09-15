import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/exhibitors", label: "Exhibitors" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  return (
    <header className="relative z-20 border-b border-line/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg tracking-tight">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-beacon/70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-beacon" />
          </span>
          Firm Expo
        </Link>
        <nav className="flex items-center gap-7 text-sm text-ink-dim">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
