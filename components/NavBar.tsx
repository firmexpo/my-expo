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
        <nav className="hidden items-center gap-7 text-sm text-ink-dim md:flex">
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

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger  className="md:hidden">
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
      <Separator className="bg-line/70" />
    </header>
  );
}