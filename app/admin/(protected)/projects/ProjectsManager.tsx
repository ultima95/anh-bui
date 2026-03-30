"use client";

import { useState, useRef } from "react";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  displayOrder: number;
}

const BLANK: Omit<Project, "id"> = {
  title: "", slug: "", description: "", techStack: [], imageUrl: null,
  demoUrl: null, githubUrl: null, featured: false, displayOrder: 0,
};

interface ProjectsManagerProps {
  initial: Project[];
  s3Configured: boolean;
}

export default function ProjectsManager({ initial, s3Configured }: ProjectsManagerProps) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Omit<Project, "id">>(BLANK);
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Omit<Project, "id">>(BLANK);
  const [busy, setBusy] = useState(false);

  function startEdit(item: Project) {
    setEditing(item.id);
    setEditData({ ...item });
  }

  async function saveEdit(id: number) {
    setBusy(true);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setItems((prev) => prev.map((p) => p.id === id ? { ...p, ...editData } : p));
      setEditing(null);
    }
    setBusy(false);
  }

  async function addItem() {
    if (!newData.title || !newData.description) return;
    setBusy(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((prev) => [...prev, created]);
      setNewData(BLANK);
      setAdding(false);
    }
    setBusy(false);
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      {items.map((item) =>
        editing === item.id ? (
          <ProjectForm
            key={item.id}
            data={editData}
            onChange={setEditData}
            onSave={() => saveEdit(item.id)}
            onCancel={() => setEditing(null)}
            busy={busy}
            s3Configured={s3Configured}
            title="Edit project"
          />
        ) : (
          <div key={item.id} className="border border-black/[0.08] rounded-xl p-5 group">
            <div className="flex items-start gap-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{item.title}</p>
                  {item.featured && <span className="text-xs bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">Featured</span>}
                </div>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">{item.description}</p>
                {item.techStack.length > 0 && (
                  <p className="text-xs text-muted mt-1">{item.techStack.join(", ")}</p>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => startEdit(item)} className={btnGhost}>Edit</button>
                <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )
      )}

      {adding ? (
        <ProjectForm
          data={newData}
          onChange={setNewData}
          onSave={addItem}
          onCancel={() => { setAdding(false); setNewData(BLANK); }}
          busy={busy}
          s3Configured={s3Configured}
          title="New project"
        />
      ) : (
        <button onClick={() => setAdding(true)} className="text-sm text-foreground hover:underline">+ Add project</button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProjectForm — shared between add and edit
// ---------------------------------------------------------------------------
function ProjectForm({
  data, onChange, onSave, onCancel, busy, s3Configured, title,
}: {
  data: Omit<Project, "id">;
  onChange: (d: Omit<Project, "id">) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
  s3Configured: boolean;
  title: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) {
      onChange({ ...data, imageUrl: json.url });
    } else {
      setUploadError(json.error ?? "Upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="border border-foreground/20 rounded-xl p-5 space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        <F label="Title *" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
        <F label="Slug" value={data.slug} onChange={(v) => onChange({ ...data, slug: v })} />
        <F label="Order" value={String(data.displayOrder)} type="number" onChange={(v) => onChange({ ...data, displayOrder: Number(v) })} />
        <F label="Demo URL" value={data.demoUrl ?? ""} onChange={(v) => onChange({ ...data, demoUrl: v })} />
        <F label="GitHub URL" value={data.githubUrl ?? ""} onChange={(v) => onChange({ ...data, githubUrl: v })} />
      </div>
      <TA label="Description *" value={data.description} onChange={(v) => onChange({ ...data, description: v })} />
      <F label="Tech stack (comma-separated)" value={data.techStack.join(", ")} onChange={(v) => onChange({ ...data, techStack: v.split(",").map((s) => s.trim()).filter(Boolean) })} />

      {/* Image */}
      <div>
        <label className="block text-xs text-muted mb-1">Image</label>
        {data.imageUrl && (
          <div className="flex items-center gap-3 mb-2">
            <img src={data.imageUrl} alt="preview" className="w-24 h-16 object-cover rounded-lg" />
            <button type="button" onClick={() => onChange({ ...data, imageUrl: null })} className="text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
        )}
        {s3Configured ? (
          <>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading}
              className="block text-xs text-muted file:mr-3 file:py-1 file:px-3 file:border file:border-black/20 file:rounded-md file:text-xs file:bg-white hover:file:bg-black/5 file:cursor-pointer" />
            {uploading && <p className="text-xs text-muted mt-1">Uploading…</p>}
            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
          </>
        ) : (
          <div className="flex gap-2 items-center">
            <F label="" value={data.imageUrl ?? ""} onChange={(v) => onChange({ ...data, imageUrl: v })} />
            <p className="text-xs text-muted whitespace-nowrap">S3 not configured — paste URL manually</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="featured" checked={data.featured} onChange={(e) => onChange({ ...data, featured: e.target.checked })} className="rounded" />
        <label htmlFor="featured" className="text-xs text-muted">Featured</label>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={busy || uploading} className={btnPrimary}>Save</button>
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      {label && <label className="block text-xs text-muted mb-1">{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 border border-black/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 bg-white" />
    </div>
  );
}

function TA({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full px-2 py-1.5 border border-black/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 bg-white resize-y" />
    </div>
  );
}

const btnPrimary = "px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-md hover:bg-foreground/80 disabled:opacity-50 transition-colors";
const btnGhost = "px-3 py-1.5 text-xs border border-black/20 rounded-md hover:bg-black/5 transition-colors";
