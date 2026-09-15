import type { Metadata } from "next";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Exhibitors — Firm Expo",
  description:
    "Bring your company to Firm Expo and give your innovations, goals, and displays a permanent home.",
};

const steps = [
  {
    n: "1",
    title: "Tell us about your company",
    body: "Send a short note about what you'd want to exhibit — a product, a research effort, a roadmap, or all three.",
  },
  {
    n: "2",
    title: "We build your floor",
    body: "Your dedicated space gets set up with your innovations, goals, and media, matched to your brand.",
  },
  {
    n: "3",
    title: "You go live",
    body: "Your exhibit joins the floor when Firm Expo opens, and you can keep it updated as your company moves forward.",
  },
];

export default function Exhibitors() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 sm:px-10">
        <p className="font-data text-sm text-ink-dim">For exhibitors</p>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Bring your company to the floor
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">
          Whether you&apos;re shipping a new product, chasing a research
          goal, or just ready to show your work to people who care, Firm
          Expo gives your company a dedicated exhibit — not a listing, an
          actual space to walk through.
        </p>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Getting a floor space
          </h2>
          <div className="mt-8 flex flex-col divide-y divide-line border-y border-line">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-6 py-7">
                <span className="font-data text-sm text-ink-faint">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-dim">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 flex flex-col items-start gap-5 rounded-lg border border-line bg-bg-panel p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">
              Ready to exhibit?
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-dim">
              Write to us with your company name and what you&apos;d like to
              show — we&apos;ll get back with next steps.
            </p>
          </div>
          <a
            href="mailto:firmexpocarnival@gmail.com?subject=Exhibitor%20interest%20-%20Firm%20Expo"
            className="shrink-0 rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-soft"
          >
            Apply to exhibit
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
