"use client";

import { useState } from "react";

interface HeroFormProps {
  initial: {
    name: string;
    tagline: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    resumeUrl: string | null;
  };
}

export function HeroForm({ initial }: HeroFormProps) {
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
      const res = await fetch("/api/admin/content/hero", {
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
      <Field label="Name" value={data.name} onChange={(v) => set("name", v)} required />
      <Field label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} required />
      <TextareaField label="Description" value={data.description} onChange={(v) => set("description", v)} required />
      <Field label="CTA Text" value={data.ctaText} onChange={(v) => set("ctaText", v)} />
      <Field label="CTA URL" value={data.ctaUrl} onChange={(v) => set("ctaUrl", v)} />
      <Field label="Resume URL" value={data.resumeUrl ?? ""} onChange={(v) => set("resumeUrl", v)} />
      <SaveButton status={status} />
    </form>
  );
}

interface AboutFormProps {
  initial: { bio: string; avatarUrl: string | null };
}

export function AboutForm({ initial }: AboutFormProps) {
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content/about", {
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
      <TextareaField
        label="Bio"
        value={data.bio}
        onChange={(v) => setData((d) => ({ ...d, bio: v }))}
        required
        rows={6}
      />
      <Field
        label="Avatar URL"
        value={data.avatarUrl ?? ""}
        onChange={(v) => setData((d) => ({ ...d, avatarUrl: v }))}
      />
      <SaveButton status={status} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function Field({
  label, value, onChange, required,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors bg-white"
      />
    </div>
  );
}

function TextareaField({
  label, value, onChange, required, rows = 4,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors bg-white resize-y"
      />
    </div>
  );
}

function SaveButton({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button
        type="submit"
        disabled={status === "saving"}
        className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/80 disabled:opacity-50 transition-colors"
      >
        {status === "saving" ? "Saving…" : "Save changes"}
      </button>
      {status === "saved" && <span className="text-xs text-green-600">Saved</span>}
      {status === "error" && <span className="text-xs text-red-600">Error saving</span>}
    </div>
  );
}
