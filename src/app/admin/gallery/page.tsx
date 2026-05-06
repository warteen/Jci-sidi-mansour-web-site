export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Plus, Edit2, Trash2, X, Save } from "lucide-react";

type GalleryImage = {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
};

const emptyForm = { title: "", description: "", imageUrl: "", category: "Event" };
const CATEGORIES = ["Event", "Forum", "Project", "Other"];

export default function GalleryAdminPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<GalleryImage | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchImages = async () => {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setImages(data);
        setLoading(false);
    };

    useEffect(() => { fetchImages(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEdit = (img: GalleryImage) => {
        setEditing(img);
        setForm({ title: img.title, description: img.description || "", imageUrl: img.imageUrl, category: img.category });
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
        if (!form.title.trim() || !form.imageUrl.trim() || !form.category) {
            setError("Title, Image URL and Category are required.");
            return;
        }
        setSaving(true);
        setError("");
        const method = editing ? "PATCH" : "POST";
        const body = editing ? { ...form, id: editing.id } : form;
        const res = await fetch("/api/gallery", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            setShowModal(false);
            fetchImages();
        } else {
            const d = await res.json();
            setError(d.error || "Failed to save.");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this image?")) return;
        await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
        fetchImages();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>Gallery Management</h1>
                    <p style={{ color: "var(--c-gray-500)", marginTop: "0.25rem" }}>Update your website's visual legacy.</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", gap: "0.5rem", alignItems: "center", height: "50px", padding: "0 1.5rem" }}>
                    <Plus size={18} /> Add New Image
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "5rem", color: "var(--c-gray-400)" }}>Loading...</div>
            ) : images.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "5rem" }}>
                    <ImageIcon size={48} style={{ color: "var(--c-gray-300)", marginBottom: "1rem", display: "block", margin: "0 auto 1rem" }} />
                    <h3 style={{ color: "var(--c-gray-400)" }}>No images found.</h3>
                    <p style={{ color: "var(--c-gray-400)" }}>Start by adding some memories to your gallery.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                    {images.map(img => (
                        <div key={img.id} style={{ background: "white", borderRadius: "1.25rem", border: "1px solid var(--c-gray-100)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}
                        >
                            <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                                <img src={img.imageUrl} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "1rem", background: "rgba(0,0,0,0.55)", color: "white", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {img.category}
                                </span>
                            </div>
                            <div style={{ padding: "1.25rem" }}>
                                <h3 style={{ fontWeight: 700, color: "var(--c-jci-marine)", marginBottom: "0.25rem" }}>{img.title}</h3>
                                {img.description && <p style={{ fontSize: "0.85rem", color: "var(--c-gray-500)", marginBottom: "1rem" }}>{img.description}</p>}
                                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                                    <button onClick={() => openEdit(img)} style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid var(--c-gray-200)", background: "white", cursor: "pointer", display: "flex", gap: "0.3rem", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 600 }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(img.id)} style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #fecaca", background: "#fff5f5", color: "#dc2626", cursor: "pointer", display: "flex", gap: "0.3rem", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 600 }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <div onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
                    <div style={{ position: "relative", background: "white", borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: "540px", boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--c-jci-marine)" }}>{editing ? "Edit Image" : "Add New Image"}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-gray-400)" }}><X size={22} /></button>
                        </div>

                        {error && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Title *</label>
                                <input className="form-input" placeholder="e.g. Annual Forum 2025" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Image Upload *</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                                {form.imageUrl && (
                                    <img src={form.imageUrl} alt="preview" onError={e => (e.currentTarget.style.display = "none")} style={{ marginTop: "0.5rem", width: "100%", height: "120px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid var(--c-gray-100)" }} />
                                )}
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Category *</label>
                                <select className="form-input" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--c-gray-600)" }}>Description</label>
                                <textarea className="form-input" placeholder="Optional description..." rows={2} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} style={{ resize: "vertical" }} />
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
