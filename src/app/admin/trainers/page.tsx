"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Save, User } from "lucide-react";

type Trainer = {
    id: string;
    name: string;
    specialty: string;
    bio?: string;
    photoUrl?: string;
};

const emptyForm = { name: "", specialty: "", bio: "", photoUrl: "" };

export default function TrainersAdminPage() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Trainer | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchTrainers = async () => {
        setLoading(true);
        const res = await fetch("/api/trainers");
        const data = await res.json();
        setTrainers(data);
        setLoading(false);
    };

    useEffect(() => { fetchTrainers(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEdit = (t: Trainer) => {
        setEditing(t);
        setForm({ name: t.name, specialty: t.specialty, bio: t.bio || "", photoUrl: t.photoUrl || "" });
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
                setForm(prev => ({ ...prev, photoUrl: data.url }));
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
        if (!form.name.trim() || !form.specialty.trim()) {
            setError("Name and Specialty are required.");
            return;
        }
        setSaving(true);
        setError("");
        const method = editing ? "PATCH" : "POST";
        const body = editing ? { ...form, id: editing.id } : form;
        const res = await fetch("/api/trainers", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            setShowModal(false);
            fetchTrainers();
        } else {
            const d = await res.json();
            setError(d.error || "Failed to save.");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this trainer?")) return;
        await fetch(`/api/trainers?id=${id}`, { method: "DELETE" });
        fetchTrainers();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>Manage Trainers</h1>
                    <p style={{ color: "var(--c-gray-500)", marginTop: "0.25rem" }}>Add, edit or remove formateurs.</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Plus size={18} /> Add Trainer
                </button>
            </div>

            <div className="card" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--c-gray-50)", borderBottom: "1px solid var(--c-gray-200)", textAlign: "left" }}>
                            <th style={{ padding: "1rem" }}>Trainer</th>
                            <th style={{ padding: "1rem" }}>Specialty</th>
                            <th style={{ padding: "1rem" }}>Bio</th>
                            <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--c-gray-400)" }}>Loading...</td></tr>
                        ) : trainers.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--c-gray-400)" }}>No trainers yet.</td></tr>
                        ) : trainers.map(t => (
                            <tr key={t.id} style={{ borderBottom: "1px solid var(--c-gray-100)" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--c-soft-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-jci-blue)", overflow: "hidden", flexShrink: 0 }}>
                                            {t.photoUrl ? <img src={t.photoUrl} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={18} />}
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{t.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "1rem", color: "var(--c-blue-600)", fontWeight: 600 }}>{t.specialty}</td>
                                <td style={{ padding: "1rem", color: "var(--c-gray-500)", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.bio || "-"}</td>
                                <td style={{ padding: "1rem", textAlign: "right" }}>
                                    <button onClick={() => openEdit(t)} style={{ padding: "0.4rem 0.8rem", marginRight: "0.5rem", borderRadius: "0.5rem", border: "1px solid var(--c-gray-200)", background: "white", cursor: "pointer", display: "inline-flex", gap: "0.3rem", alignItems: "center", fontSize: "0.85rem" }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #fecaca", background: "#fff5f5", color: "#dc2626", cursor: "pointer", display: "inline-flex", gap: "0.3rem", alignItems: "center", fontSize: "0.85rem" }}>
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
                            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--c-jci-marine)" }}>{editing ? "Edit Trainer" : "Add New Trainer"}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-gray-400)" }}><X size={22} /></button>
                        </div>

                        {error && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Full Name *</label>
                                <input className="form-input" placeholder="e.g. Asma Khemiri" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Specialty *</label>
                                <input className="form-input" placeholder="e.g. Soft Skills Trainer" value={form.specialty} onChange={e => setForm(prev => ({ ...prev, specialty: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Bio</label>
                                <textarea className="form-input" rows={3} placeholder="Short bio..." value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Photo</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                                {form.photoUrl && (
                                    <div style={{ marginTop: "1rem" }}>
                                        <img src={form.photoUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "2px solid var(--c-jci-blue)" }} />
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
