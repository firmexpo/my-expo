"use client";

import { useState } from "react";

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    const subject = encodeURIComponent("Add me to the Firm Expo waitlist");
    const body = encodeURIComponent(
      `Please add this address to the waitlist: ${email}`
    );
    window.location.href = `mailto:firmexpocarnival@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="font-data text-sm text-beacon">
        Almost done — confirm the email that just opened in your mail app.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-md border border-line bg-bg-panel px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-soft"
      >
        Join the waitlist
      </button>
    </form>
  );
}
