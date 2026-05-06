"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function HeroImageUploader({ currentImageUrl }: { currentImageUrl: string }) {
    const [imageUrl, setImageUrl] = useState(currentImageUrl);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        
        setSaving(true);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                const newUrl = data.url;
                setImageUrl(newUrl);
                
                await fetch("/api/config", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: "hero_image", value: newUrl })
                });

                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (e) {
            console.error("Upload failed", e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--c-jci-marine)", fontWeight: 800 }}>Home Page Hero Image</h2>
            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 300px" }}>
                    <p style={{ color: "var(--c-gray-500)", marginBottom: "1rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
                        Update the main leadership image displayed on the home page. The image will be cropped to fit automatically.
                    </p>
                    
                    <label className="btn btn-primary" style={{ display: "inline-flex", gap: "0.5rem", cursor: "pointer", height: "auto", padding: "0.8rem 1.5rem" }}>
                        <Upload size={18} /> {saving ? "Uploading..." : "Upload New Image"}
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} disabled={saving} />
                    </label>
                    {success && <p style={{ color: "#16a34a", marginTop: "0.75rem", fontSize: "0.9rem", fontWeight: 600 }}>Image updated successfully !</p>}
                </div>
                
                <div style={{ width: "200px", height: "250px", borderRadius: "1rem", overflow: "hidden", background: "var(--c-gray-100)", border: "1px solid var(--c-gray-200)", boxShadow: "var(--shadow-md)" }}>
                    <img src={imageUrl} alt="Hero Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            </div>
        </div>
    );
}
