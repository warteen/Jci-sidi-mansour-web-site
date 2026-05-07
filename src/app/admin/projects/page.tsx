"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Briefcase } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    date: string;
};

const emptyForm = { title: "", description: "", imageUrl: "", date: "" };

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        setLoading(true);
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
        setLoading(false);
    };

    useEffect(() => { fetchProjects(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEdit = (p: Project) => {
        setEditing(p);
        setForm({
            title: p.title,
            description: p.description,
            imageUrl: p.imageUrl || "",
            date: new Date(p.date).toISOString().split("T")[0],
        });
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
        if (!form.title.trim() || !form.description.trim() || !form.date) {
            setError("Title, description and date are required.");
            return;
        }
        setSaving(true);
        setError("");
        const method = editing ? "PATCH" : "POST";
        const body = editing ? { ...form, id: editing.id } : form;
        const res = await fetch("/api/projects", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            setShowModal(false);
            fetchProjects();
        } else {
            const d = await res.json();
            setError(d.error || "Failed to save.");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
        fetchProjects();
    };

    return (
        <div style={{ padding: "clamp(1rem, 5vw, 2rem)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>Manage Projects</h1>
                    <p style={{ color: "var(--c-gray-500)", marginTop: "0.25rem" }}>Add, edit or remove JCI projects.</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Plus size={18} /> Add Project
                </button>
            </div>

            <div className="card" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                        <tr style={{ background: "var(--c-gray-50)", borderBottom: "1px solid var(--c-gray-200)", textAlign: "left" }}>
                            <th style={{ padding: "1rem" }}>Title</th>
                            <th style={{ padding: "1rem" }}>Description</th>
                            <th style={{ padding: "1rem" }}>Date</th>
                            <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--c-gray-400)" }}>Loading...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: "4rem", textAlign: "center" }}>
                                    <Briefcase size={40} style={{ margin: "0 auto 1rem", color: "var(--c-gray-300)", display: "block" }} />
                                    <p style={{ color: "var(--c-gray-400)" }}>No projects yet. Add your first one!</p>
                                </td>
                            </tr>
                        ) : projects.map(p => (
                            <tr key={p.id} style={{ borderBottom: "1px solid var(--c-gray-100)" }}>
                                <td style={{ padding: "1rem", fontWeight: 600, color: "var(--c-jci-marine)" }}>{p.title}</td>
                                <td style={{ padding: "1rem", color: "var(--c-gray-500)", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.description}</td>
                                <td style={{ padding: "1rem", color: "var(--c-gray-500)", fontSize: "0.9rem" }}>{new Date(p.date).toLocaleDateString()}</td>
                                <td style={{ padding: "1rem", textAlign: "right" }}>
                                    <button onClick={() => openEdit(p)} style={{ padding: "0.4rem 0.8rem", marginRight: "0.5rem", borderRadius: "0.5rem", border: "1px solid var(--c-gray-200)", background: "white", cursor: "pointer", display: "inline-flex", gap: "0.3rem", alignItems: "center", fontSize: "0.85rem" }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #fecaca", background: "#fff5f5", color: "#dc2626", cursor: "pointer", display: "inline-flex", gap: "0.3rem", alignItems: "center", fontSize: "0.85rem" }}>
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
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <div onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
                    <div style={{ position: "relative", background: "white", borderRadius: "1.5rem", padding: "clamp(1.5rem, 5vw, 2rem)", width: "100%", maxWidth: "540px", boxShadow: "0 25px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--c-jci-marine)" }}>{editing ? "Edit Project" : "Add New Project"}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-gray-400)" }}><X size={22} /></button>
                        </div>

                        {error && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Title *</label>
                                <input className="form-input" placeholder="e.g. Youth Leadership Program" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Description *</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Describe the project..."
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    style={{ resize: "vertical" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Date *</label>
                                <input className="form-input" type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Image</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                                {form.imageUrl && (
                                    <div style={{ marginTop: "1rem" }}>
                                        <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid var(--c-gray-100)" }} />
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
