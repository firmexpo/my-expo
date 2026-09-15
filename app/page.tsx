import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotifyForm from "./components/NotifyForm";
import PavilionGrid from "./components/PavilionGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="relative flex flex-1 items-center overflow-hidden">
        <div className="grid-field pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-signal/20 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 py-20 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-data text-sm text-ink-dim">
              Status: building the exhibition floor
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Where companies digitally expose their innovations
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
              Firm Expo is a digital exposition platform: one stage where
              companies present what they&apos;ve built, where they&apos;re
              headed, and what they stand for — to the people who should be
              watching.
            </p>

            <div className="mt-10">
              <NotifyForm />
              <p className="mt-3 font-data text-xs text-ink-faint">
                No spam. Just an email when the floor opens.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PavilionGrid />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
