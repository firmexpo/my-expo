"use client";

import { useEffect, useState } from "react";
import NotifyForm from "./NotifyForm";

export default function UpdatesDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-signal py-3 pl-4 pr-5 text-sm font-medium text-ink shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] transition-transform hover:bg-signal-soft hover:scale-105 ${
          open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
        }`}
        style={{ transition: "opacity 0.25s ease, transform 0.25s ease" }}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fab-wave"
        >
          <path d="M8 21c-2-1-3-3-3-5v-3.5a1.5 1.5 0 0 1 3 0" />
          <path d="M8 12.5V6a1.5 1.5 0 0 1 3 0v5" />
          <path d="M11 11V5a1.5 1.5 0 0 1 3 0v6" />
          <path d="M14 11.2V7a1.5 1.5 0 0 1 3 0v7c0 3.5-2 7-6 7h-1c-2 0-3-.7-4.2-2.2L4.6 16" />
        </svg>
        Keep me updated
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get future updates"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-bg-panel transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-6 sm:px-8">
          <div>
            <p className="font-data text-xs text-signal">Stay in the loop</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
              Get future updates
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="mt-1 shrink-0 rounded-md p-1.5 text-ink-faint transition-colors hover:bg-bg-panel-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <p className="text-sm leading-relaxed text-ink-dim">
            Firm Expo is still under construction. Leave your details and
            we&apos;ll email you the moment the floor opens — plus early
            access if you want to exhibit your own company.
          </p>

          <div className="mt-8">
            <NotifyForm onSuccess={() => setTimeout(() => setOpen(false), 2200)} />
          </div>

          <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-ink-faint">
            We only use this to send launch updates. No spam, and you can
            ask to be removed at any time by emailing{" "}
            <a href="mailto:firmexpocarnival@gmail.com" className="text-ink-dim hover:text-signal">
              firmexpocarnival@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
