"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Setup failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-muted mb-2">Admin</p>
          <h1 className="text-2xl font-semibold text-foreground">Set up admin access</h1>
          <p className="text-sm text-muted mt-2">
            Create a password to protect your admin panel. This can only be done once.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2.5 border border-black/20 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2.5 border border-black/20 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"
              placeholder="Repeat your password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Setting up…" : "Create admin account"}
          </button>
        </form>
      </div>
    </div>
  );
}
