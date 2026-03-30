"use client";

import { useState } from "react";

interface ContactFormProps {
  initial: {
    email: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
  };
}

export default function ContactForm({ initial }: ContactFormProps) {
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function set(field: string, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
        <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} required
          className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors bg-white" />
      </div>
      {(["githubUrl", "linkedinUrl", "twitterUrl"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {field === "githubUrl" ? "GitHub URL" : field === "linkedinUrl" ? "LinkedIn URL" : "Twitter URL"}
          </label>
          <input type="url" value={data[field] ?? ""} onChange={(e) => set(field, e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors bg-white" />
        </div>
      ))}
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={status === "saving"}
          className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/80 disabled:opacity-50 transition-colors">
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && <span className="text-xs text-green-600">Saved</span>}
        {status === "error" && <span className="text-xs text-red-600">Error saving</span>}
      </div>
    </form>
  );
}
