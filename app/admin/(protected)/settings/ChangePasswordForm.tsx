"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (res.ok) {
        setSuccess(true);
        setCurrent(""); setNext(""); setConfirm("");
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      {[
        { id: "current",  label: "Current password",     value: current,  set: setCurrent,  complete: "current-password" },
        { id: "next",     label: "New password",          value: next,     set: setNext,     complete: "new-password" },
        { id: "confirm",  label: "Confirm new password",  value: confirm,  set: setConfirm,  complete: "new-password" },
      ].map(({ id, label, value, set, complete }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
          <input
            id={id}
            type="password"
            value={value}
            onChange={(e) => set(e.target.value)}
            required
            minLength={id === "current" ? 1 : 8}
            autoComplete={complete}
            className="w-full px-3 py-2.5 border border-black/20 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"
          />
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          Password updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
