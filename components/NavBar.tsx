"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logoMark from "@/public/brand/logo-mark.png";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/exhibitors", label: "Exhibitors" },
  { href: "/contact", label: "Contact" },
];

const demoHref = "/demo";

// Eye-catching entry point to the demo exhibition: filled accent pill, a
// pulsing "live" dot and a soft glow so it reads at a glance.
function DemoCta({ className = "" }: { className?: string }) {
  return (
    <Link
      href={demoHref}
      className={`group relative inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-signal px-4 py-2 text-sm font-semibold text-bg shadow-[0_0_0_1px_rgba(255,180,84,0.5),0_0_22px_rgba(245,129,15,0.45)] transition-all duration-200 hover:bg-beacon hover:shadow-[0_0_0_1px_rgba(255,180,84,0.8),0_0_30px_rgba(255,180,84,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-bg" />
      </span>
      <span>
        Demo<span className="hidden min-[420px]:inline"> Exhibition</span>
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        {/* Logo — no hover feedback */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f4f2ea] p-1.5">
            <Image
              src={logoMark}
              alt=""
              width={30}
              height={24}
              priority
              className="h-full w-auto"
            />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Firm<span className="text-signal">Expo</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
        <nav className="flex items-center gap-7 text-sm text-ink-dim">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100 ${
                  active ? "after:scale-x-100" : "after:scale-x-0"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <DemoCta />
        </div>

        {/* Mobile: CTA stays visible in the bar, menu holds the rest */}
        <div className="flex items-center gap-2 md:hidden">
        <DemoCta className="px-3 py-1.5 text-xs" />
        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent focus-visible:bg-transparent"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-bg">
            <nav className="mt-8 flex flex-col gap-1 text-sm text-ink-dim">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 transition-colors hover:bg-line/40 ${
                      active ? "bg-line/40 text-ink" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
      <Separator className="bg-line/70" />
    </header>
  );
}