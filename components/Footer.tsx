import Image from "next/image";
import Link from "next/link";
import logoMark from "@/public/brand/logo-mark.png";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-sm text-ink-faint">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#f4f2ea] p-1">
              <Image src={logoMark} alt="" width={20} height={16} className="h-full w-auto" />
            </span>
            <span>Firm Expo — a digital exposition platform.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-ink-faint">
            <Link href="/about" className="hover:text-ink-dim">About</Link>
            <Link href="/exhibitors" className="hover:text-ink-dim">Exhibitors</Link>
            <Link href="/contact" className="hover:text-ink-dim">Contact</Link>
            <a href="mailto:firmexpocarnival@gmail.com" className="hover:text-ink-dim">
              firmexpocarnival@gmail.com
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line/60 pt-6">
          <p className="font-data text-xs text-ink-faint">Your business, on display.</p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
