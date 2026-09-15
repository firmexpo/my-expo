import Image from "next/image";
import Link from "next/link";
import logoMark from "@/public/brand/logo-mark.png";

const links = [
  { href: "/about", label: "About" },
  { href: "/exhibitors", label: "Exhibitors" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  return (
    <header className="relative z-20 border-b border-line/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f4f2ea] p-1.5">
            <Image src={logoMark} alt="" width={30} height={24} priority className="h-full w-auto" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Firm<span className="text-signal">Expo</span>
          </span>
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
