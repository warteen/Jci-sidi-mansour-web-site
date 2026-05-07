"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";

interface JoinModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        fieldOfStudy: "",
        skills: "",
        interests: "",
        motivation: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: "absolute", inset: 0, background: "rgba(19, 15, 44, 0.8)", backdropFilter: "blur(8px)" }}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{ 
                            position: "relative", 
                            width: "100%", 
                            maxWidth: "700px", 
                            background: "white", 
                            borderRadius: "2rem", 
                            padding: "clamp(1.5rem, 5vw, 3rem)",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                        }}
                    >
                        <button 
                            onClick={onClose}
                            style={{ position: "absolute", top: "1.5rem", right: "1.5rem", color: "var(--c-gray-400)", background: "none", border: "none", cursor: "pointer" }}
                        >
                            <X size={24} />
                        </button>

                        {!submitted ? (
                            <>
                                <div style={{ marginBottom: "2.5rem" }}>
                                    <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginBottom: "0.5rem" }}>Join JCI Sidi Mansour</h2>
                                    <p style={{ color: "var(--c-gray-500)", fontSize: "1.1rem" }}>Take the first step toward impactful leadership.</p>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "1.5rem" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Full Name *</label>
                                            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Phone Number *</label>
                                            <input required name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+216 ..." />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Email Address *</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="john@example.com" />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Field of Study / Profession</label>
                                        <input name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="form-input" placeholder="Software Engineering / Marketing" />
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "1.5rem" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Skills</label>
                                            <input name="skills" value={formData.skills} onChange={handleChange} className="form-input" placeholder="Design, Management, etc." />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Interests</label>
                                            <input name="interests" value={formData.interests} onChange={handleChange} className="form-input" placeholder="Social Impact, Tech, etc." />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--c-jci-blue)", textTransform: "uppercase" }}>Why do you want to join? (Motivation)</label>
                                        <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows={4} className="form-input" style={{ resize: "none" }} placeholder="Tell us about yourself and your goals..." />
                                    </div>

                                    {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

                                    <button 
                                        disabled={loading}
                                        type="submit" 
                                        className="btn btn-primary" 
                                        style={{ width: "100%", height: "60px", marginTop: "1rem" }}
                                    >
                                        {loading ? "Submitting..." : (
                                            <>Submit Application <Send size={18} style={{ marginLeft: "0.75rem" }} /></>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: "center", padding: "2rem 0" }}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12 }}
                                    style={{ color: "var(--c-jci-blue)", marginBottom: "2rem" }}
                                >
                                    <CheckCircle2 size={80} style={{ margin: "0 auto" }} />
                                </motion.div>
                                <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginBottom: "1rem" }}>Application Sent!</h2>
                                <p style={{ color: "var(--c-gray-500)", fontSize: "1.2rem", maxWidth: "400px", margin: "0 auto 2rem" }}>
                                    Thank you for your interest in JCI Sidi Mansour. Our team will review your application and contact you soon.
                                </p>
                                <button onClick={onClose} className="btn btn-outline" style={{ padding: "0 3rem", height: "55px" }}>Close</button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
