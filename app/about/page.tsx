import type { Metadata } from "next";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Firm Expo is a digital exposition platform giving companies a permanent, explorable exhibit for their innovations, goals, and displays.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Firm Expo",
    description:
      "Firm Expo is a digital exposition platform giving companies a permanent, explorable exhibit for their innovations, goals, and displays.",
    url: "/about",
    type: "website",
  },
};

const facets = [
  {
    title: "Innovations",
    body: "What a company has built — products, research, prototypes — presented in a format made for scrolling, not skimming a PDF.",
  },
  {
    title: "Goals",
    body: "Where a company is headed next: the roadmap, the open problems, the direction they want partners and talent to know about.",
  },
  {
    title: "Displays",
    body: "A dedicated space per exhibitor — image, video, and write-ups arranged like a booth, built to be walked through rather than read as a page.",
  },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 sm:px-10">
        <p className="font-data text-sm text-ink-dim">About</p>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          A stage for companies to show their work
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">
          Most of what a company builds never reaches the people who&apos;d
          care about it. It sits in a press release, a slide deck, or a page
          nobody visits. Firm Expo gives that work an actual exhibition —
          a digital hall where a company&apos;s innovations, goals, and
          displays live in one place, built to be explored rather than
          announced once and forgotten.
        </p>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            What lives on a company&apos;s floor
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            {facets.map((f) => (
              <div key={f.title} className="bg-bg-panel p-7">
                <h3 className="font-display text-lg font-medium text-ink">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Why we&apos;re building it
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-dim">
            We think an exposition shouldn&apos;t require a plane ticket or a
            trade-show booth fee. Firm Expo is the digital version: open
            longer, reachable further, and free from the noise of a
            conference floor. Companies get a permanent, well-designed home
            for their story. Visitors get a place to see what&apos;s actually
            being built, not just what&apos;s being marketed.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
