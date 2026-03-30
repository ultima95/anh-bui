"use client";

import { useState } from "react";

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiencyLevel: number;
  displayOrder: number;
}

const BLANK: Omit<Skill, "id"> = { name: "", category: "", proficiencyLevel: 3, displayOrder: 0 };

export default function SkillsManager({ initial }: { initial: Skill[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Omit<Skill, "id">>(BLANK);
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Omit<Skill, "id">>(BLANK);
  const [busy, setBusy] = useState(false);

  async function saveEdit(id: number) {
    setBusy(true);
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...editData } : s)));
      setEditing(null);
    }
    setBusy(false);
  }

  async function deleteSkill(id: number) {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  async function addSkill() {
    if (!newData.name || !newData.category) return;
    setBusy(true);
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/[0.08]">
            <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase tracking-wide">Name</th>
            <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase tracking-wide">Category</th>
            <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase tracking-wide">Level</th>
            <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase tracking-wide">Order</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((skill) =>
            editing === skill.id ? (
              <tr key={skill.id} className="border-b border-black/[0.04]">
                <td className="py-2 pr-3"><input className={inputCls} value={editData.name} onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))} /></td>
                <td className="py-2 pr-3"><input className={inputCls} value={editData.category} onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))} /></td>
                <td className="py-2 pr-3"><input className={inputCls} type="number" min={1} max={5} value={editData.proficiencyLevel} onChange={(e) => setEditData((d) => ({ ...d, proficiencyLevel: Number(e.target.value) }))} /></td>
                <td className="py-2 pr-3"><input className={inputCls} type="number" value={editData.displayOrder} onChange={(e) => setEditData((d) => ({ ...d, displayOrder: Number(e.target.value) }))} /></td>
                <td className="py-2 flex gap-2">
                  <button onClick={() => saveEdit(skill.id)} disabled={busy} className={btnPrimary}>Save</button>
                  <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={skill.id} className="border-b border-black/[0.04] group">
                <td className="py-2.5 pr-4">{skill.name}</td>
                <td className="py-2.5 pr-4 text-muted">{skill.category}</td>
                <td className="py-2.5 pr-4 text-muted">{skill.proficiencyLevel}/5</td>
                <td className="py-2.5 pr-4 text-muted">{skill.displayOrder}</td>
                <td className="py-2.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(skill.id); setEditData({ name: skill.name, category: skill.category, proficiencyLevel: skill.proficiencyLevel, displayOrder: skill.displayOrder }); }} className={btnGhost}>Edit</button>
                  <button onClick={() => deleteSkill(skill.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {adding ? (
        <div className="mt-4 flex gap-3 items-end flex-wrap">
          <div><label className={labelCls}>Name</label><input className={inputCls} value={newData.name} onChange={(e) => setNewData((d) => ({ ...d, name: e.target.value }))} /></div>
          <div><label className={labelCls}>Category</label><input className={inputCls} value={newData.category} onChange={(e) => setNewData((d) => ({ ...d, category: e.target.value }))} /></div>
          <div><label className={labelCls}>Level (1–5)</label><input className={inputCls} type="number" min={1} max={5} value={newData.proficiencyLevel} onChange={(e) => setNewData((d) => ({ ...d, proficiencyLevel: Number(e.target.value) }))} /></div>
          <div><label className={labelCls}>Order</label><input className={inputCls} type="number" value={newData.displayOrder} onChange={(e) => setNewData((d) => ({ ...d, displayOrder: Number(e.target.value) }))} /></div>
          <button onClick={addSkill} disabled={busy} className={btnPrimary}>Add</button>
          <button onClick={() => { setAdding(false); setNewData(BLANK); }} className={btnGhost}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="mt-4 text-sm text-foreground hover:underline">+ Add skill</button>
      )}
    </div>
  );
}

const inputCls = "w-full px-2 py-1.5 border border-black/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 bg-white";
const labelCls = "block text-xs text-muted mb-1";
const btnPrimary = "px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-md hover:bg-foreground/80 disabled:opacity-50 transition-colors";
const btnGhost = "px-3 py-1.5 text-xs border border-black/20 rounded-md hover:bg-black/5 transition-colors";
