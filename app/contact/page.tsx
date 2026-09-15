import type { Metadata } from "next";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Contact — Firm Expo",
  description: "Get in touch with the Firm Expo team.",
};

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 sm:px-10">
        <p className="font-data text-sm text-ink-dim">Contact</p>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
          Questions about exhibiting, partnering, or just want to know when
          the floor opens — write to us directly.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-bg-panel p-8">
            <h2 className="font-display text-lg font-medium text-ink">
              Email
            </h2>
            <a
              href="mailto:firmexpocarnival@gmail.com"
              className="mt-3 block font-data text-base text-beacon hover:underline"
            >
              firmexpocarnival@gmail.com
            </a>
            <p className="mt-4 text-sm leading-relaxed text-ink-dim">
              We read every message and typically reply within a few days.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-bg-panel p-8">
            <h2 className="font-display text-lg font-medium text-ink">
              What to include
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-dim">
              <li>Your name and company (if you have one)</li>
              <li>What you&apos;re reaching out about</li>
              <li>Any links that help us understand your work</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <a
            href="mailto:firmexpocarnival@gmail.com?subject=Hello%20Firm%20Expo"
            className="inline-block rounded-md bg-signal px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-soft"
          >
            Send us an email
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
