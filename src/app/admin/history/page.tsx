export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Clock, Image as ImageIcon } from "lucide-react";

type HistoryEntry = {
    id: string;
    year: string;
    title: string;
    description: string;
    imageUrl?: string;
};

const emptyForm = { year: "", title: "", description: "", imageUrl: "" };

export default function HistoryAdminPage() {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<HistoryEntry | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchEntries = async () => {
        setLoading(true);
        const res = await fetch("/api/history");
        const data = await res.json();
        setEntries(data);
        setLoading(false);
    };

    useEffect(() => { fetchEntries(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEdit = (e: HistoryEntry) => {
        setEditing(e);
        setForm({ year: e.year, title: e.title, description: e.description, imageUrl: e.imageUrl || "" });
        setError("");
        setShowModal(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        try {
            setSaving(true);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                setForm(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                setError(data.error || "Upload failed");
            }
        } catch (err) {
            setError("Upload failed");
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!form.year.trim() || !form.title.trim() || !form.description.trim()) {
            setError("Year, Title, and Description are required.");
            return;
        }
        setSaving(true);
        setError("");
        const method = editing ? "PATCH" : "POST";
        const body = editing ? { ...form, id: editing.id } : form;
        const res = await fetch("/api/history", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            setShowModal(false);
            fetchEntries();
        } else {
            const d = await res.json();
            setError(d.error || "Failed to save.");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this history entry?")) return;
        await fetch(`/api/history?id=${id}`, { method: "DELETE" });
        fetchEntries();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>Manage History Timeline</h1>
                    <p style={{ color: "var(--c-gray-500)", marginTop: "0.25rem" }}>Add, edit or remove milestones.</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Plus size={18} /> Add Entry
                </button>
            </div>

            <div className="card" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--c-gray-50)", borderBottom: "1px solid var(--c-gray-200)", textAlign: "left" }}>
                            <th style={{ padding: "1rem" }}>Year</th>
                            <th style={{ padding: "1rem" }}>Title</th>
                            <th style={{ padding: "1rem" }}>Description</th>
                            <th style={{ padding: "1rem" }}>Image</th>
                            <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--c-gray-400)" }}>Loading...</td></tr>
                        ) : entries.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--c-gray-400)" }}>No entries yet.</td></tr>
                        ) : entries.map(ent => (
                            <tr key={ent.id} style={{ borderBottom: "1px solid var(--c-gray-100)" }}>
                                <td style={{ padding: "1rem", color: "var(--c-jci-blue)", fontWeight: 800 }}>{ent.year}</td>
                                <td style={{ padding: "1rem", fontWeight: 600 }}>{ent.title}</td>
                                <td style={{ padding: "1rem", color: "var(--c-gray-500)", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ent.description}</td>
                                <td style={{ padding: "1rem" }}>
                                    {ent.imageUrl ? <img src={ent.imageUrl} alt={ent.title} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }} /> : <ImageIcon size={20} color="var(--c-gray-300)" />}
                                </td>
                                <td style={{ padding: "1rem", textAlign: "right" }}>
                                    <button onClick={() => openEdit(ent)} style={{ padding: "0.4rem 0.8rem", marginRight: "0.5rem", borderRadius: "0.5rem", border: "1px solid var(--c-gray-200)", background: "white", cursor: "pointer", display: "inline-flex", gap: "0.3rem", alignItems: "center", fontSize: "0.85rem" }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(ent.id)} style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #fecaca", background: "#fff5f5", color: "#dc2626", cursor: "pointer", display: "inline-flex", gap: "0.3rem", alignItems: "center", fontSize: "0.85rem" }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <div onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
                    <div style={{ position: "relative", background: "white", borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: "520px", boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--c-jci-marine)" }}>{editing ? "Edit Entry" : "Add New Entry"}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-gray-400)" }}><X size={22} /></button>
                        </div>

                        {error && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Year *</label>
                                <input className="form-input" placeholder="e.g. 2015" value={form.year} onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Title *</label>
                                <input className="form-input" placeholder="e.g. Founded Chapter" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Description *</label>
                                <textarea className="form-input" rows={4} placeholder="Description..." value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Image (Optional)</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                                {form.imageUrl && (
                                    <div style={{ marginTop: "1rem" }}>
                                        <img src={form.imageUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "2px solid var(--c-jci-blue)" }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "0.75rem", border: "1px solid var(--c-gray-200)", background: "white", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ padding: "0.75rem 2rem", height: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <Save size={16} /> {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
