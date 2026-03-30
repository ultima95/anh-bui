"use client";

import { useState } from "react";

interface Exp {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  location: string | null;
  displayOrder: number;
}

const BLANK: Omit<Exp, "id"> = {
  company: "", position: "", startDate: "", endDate: "", description: "", location: "", displayOrder: 0,
};

export default function ExperienceManager({ initial }: { initial: Exp[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Omit<Exp, "id">>(BLANK);
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Omit<Exp, "id">>(BLANK);
  const [busy, setBusy] = useState(false);

  function startEdit(item: Exp) {
    setEditing(item.id);
    setEditData({ company: item.company, position: item.position, startDate: item.startDate, endDate: item.endDate ?? "", description: item.description, location: item.location ?? "", displayOrder: item.displayOrder });
  }

  async function saveEdit(id: number) {
    setBusy(true);
    const res = await fetch(`/api/admin/experience/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setItems((prev) => prev.map((e) => e.id === id ? { ...e, ...editData, endDate: editData.endDate || null, location: editData.location || null } : e));
      setEditing(null);
    }
    setBusy(false);
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this experience entry?")) return;
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((e) => e.id !== id));
  }

  async function addItem() {
    if (!newData.company || !newData.position || !newData.startDate || !newData.description) return;
    setBusy(true);
    const res = await fetch("/api/admin/experience", {
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

  return (
    <div className="space-y-4">
      {items.map((item) =>
        editing === item.id ? (
          <div key={item.id} className="border border-foreground/20 rounded-xl p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <F label="Company *" value={editData.company} onChange={(v) => setEditData((d) => ({ ...d, company: v }))} />
              <F label="Position *" value={editData.position} onChange={(v) => setEditData((d) => ({ ...d, position: v }))} />
              <F label="Start Date *" value={editData.startDate} onChange={(v) => setEditData((d) => ({ ...d, startDate: v }))} placeholder="e.g. Jan 2023" />
              <F label="End Date" value={editData.endDate ?? ""} onChange={(v) => setEditData((d) => ({ ...d, endDate: v }))} placeholder="Leave blank for present" />
              <F label="Location" value={editData.location ?? ""} onChange={(v) => setEditData((d) => ({ ...d, location: v }))} />
              <F label="Order" value={String(editData.displayOrder)} onChange={(v) => setEditData((d) => ({ ...d, displayOrder: Number(v) }))} type="number" />
            </div>
            <TA label="Description *" value={editData.description} onChange={(v) => setEditData((d) => ({ ...d, description: v }))} />
            <div className="flex gap-2 pt-1">
              <button onClick={() => saveEdit(item.id)} disabled={busy} className={btnPrimary}>Save</button>
              <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
            </div>
          </div>
        ) : (
          <div key={item.id} className="border border-black/[0.08] rounded-xl p-5 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{item.position} <span className="text-muted font-normal">at {item.company}</span></p>
                <p className="text-xs text-muted mt-0.5">{item.startDate} — {item.endDate ?? "Present"}{item.location ? ` · ${item.location}` : ""}</p>
                <p className="text-sm mt-2 text-foreground/80 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                <button onClick={() => startEdit(item)} className={btnGhost}>Edit</button>
                <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )
      )}

      {adding ? (
        <div className="border border-foreground/20 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">New entry</p>
          <div className="grid grid-cols-2 gap-3">
            <F label="Company *" value={newData.company} onChange={(v) => setNewData((d) => ({ ...d, company: v }))} />
            <F label="Position *" value={newData.position} onChange={(v) => setNewData((d) => ({ ...d, position: v }))} />
            <F label="Start Date *" value={newData.startDate} onChange={(v) => setNewData((d) => ({ ...d, startDate: v }))} placeholder="e.g. Jan 2023" />
            <F label="End Date" value={newData.endDate ?? ""} onChange={(v) => setNewData((d) => ({ ...d, endDate: v }))} placeholder="Leave blank for present" />
            <F label="Location" value={newData.location ?? ""} onChange={(v) => setNewData((d) => ({ ...d, location: v }))} />
            <F label="Order" value={String(newData.displayOrder)} onChange={(v) => setNewData((d) => ({ ...d, displayOrder: Number(v) }))} type="number" />
          </div>
          <TA label="Description *" value={newData.description} onChange={(v) => setNewData((d) => ({ ...d, description: v }))} />
          <div className="flex gap-2 pt-1">
            <button onClick={addItem} disabled={busy} className={btnPrimary}>Add</button>
            <button onClick={() => { setAdding(false); setNewData(BLANK); }} className={btnGhost}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="text-sm text-foreground hover:underline">+ Add experience</button>
      )}
    </div>
  );
}

function F({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
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
