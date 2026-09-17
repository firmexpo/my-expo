"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Could not sign in.");
        setLoading(false);
        return;
      }

      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-line bg-bg-panel p-8"
      >
        <p className="font-data text-xs text-signal">Firm Expo</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-ink-dim">
          Enter the admin password to manage leads.
        </p>

        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-md border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal"
        />

        {error && (
          <p role="alert" className="mt-3 text-xs text-signal">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-soft disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
