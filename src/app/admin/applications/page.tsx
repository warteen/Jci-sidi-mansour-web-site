"use client";

import { useEffect, useState } from "react";
import { 
    Search, Plus, Filter, MoreHorizontal, Eye, 
    Trash2, CheckCircle, XCircle, Clock, PhoneCall,
    Mail, Phone, MapPin, User, BookOpen, Star, Heart,
    X, Download, Calendar
} from "lucide-react";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedApp, setSelectedApp] = useState<any>(null);

    const statuses = ["All", "New", "Contacted", "Accepted", "Rejected"];

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/applications?search=${search}&status=${statusFilter}`);
            const data = await res.json();
            setApplications(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [search, statusFilter]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await fetch("/api/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            fetchApplications();
            if (selectedApp && selectedApp.id === id) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
            fetchApplications();
            setSelectedApp(null);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Accepted": return { bg: "#DEF7EC", color: "#03543F", icon: <CheckCircle size={14} /> };
            case "Rejected": return { bg: "#FDE8E8", color: "#9B1C1C", icon: <XCircle size={14} /> };
            case "Contacted": return { bg: "#E1EFFE", color: "#1E429F", icon: <PhoneCall size={14} /> };
            default: return { bg: "#F3F4F6", color: "#374151", icon: <Clock size={14} /> };
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-marine)", marginBottom: "0.5rem" }}>Membership Applications</h1>
                    <p style={{ color: "var(--c-gray-500)" }}>Manage new candidates for JCI Sidi Mansour.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ position: "relative" }}>
                        <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--c-gray-400)" }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search applications..." 
                            style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "0.75rem", border: "1px solid var(--c-gray-200)", width: "300px", outline: "none" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
                {statuses.map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        style={{
                            padding: "0.5rem 1.25rem",
                            borderRadius: "var(--radius-full)",
                            border: "1px solid",
                            borderColor: statusFilter === s ? "var(--c-jci-blue)" : "var(--c-gray-200)",
                            background: statusFilter === s ? "var(--c-jci-blue)" : "white",
                            color: statusFilter === s ? "white" : "var(--c-gray-600)",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: "1.5rem", border: "1px solid var(--c-gray-100)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "var(--c-gray-50)", borderBottom: "1px solid var(--c-gray-100)" }}>
                            <th style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-500)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase" }}>Candidate</th>
                            <th style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-500)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase" }}>Profession/Study</th>
                            <th style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-500)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase" }}>Status</th>
                            <th style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-500)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase" }}>Date</th>
                            <th style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-500)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: "4rem", textAlign: "center", color: "var(--c-gray-400)" }}>Loading applications...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: "4rem", textAlign: "center", color: "var(--c-gray-400)" }}>No applications found.</td></tr>
                        ) : (
                            applications.map((app) => {
                                const statusInfo = getStatusStyle(app.status);
                                return (
                                    <tr key={app.id} style={{ borderBottom: "1px solid var(--c-gray-50)", transition: "all 0.2s" }} className="table-row-hover">
                                        <td style={{ padding: "1.25rem 1.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontWeight: 700, color: "var(--c-jci-marine)" }}>{app.fullName}</span>
                                                <span style={{ fontSize: "0.85rem", color: "var(--c-gray-500)" }}>{app.email}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-600)", fontSize: "0.95rem" }}>
                                            {app.fieldOfStudy || "N/A"}
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem" }}>
                                            <span style={{ 
                                                display: "inline-flex", alignItems: "center", gap: "0.4rem", 
                                                padding: "0.3rem 0.8rem", borderRadius: "1rem", 
                                                fontSize: "0.75rem", fontWeight: 700,
                                                background: statusInfo.bg, color: statusInfo.color
                                            }}>
                                                {statusInfo.icon} {app.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem", color: "var(--c-gray-400)", fontSize: "0.85rem" }}>
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                <button 
                                                    onClick={() => setSelectedApp(app)}
                                                    style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "none", background: "var(--c-gray-50)", cursor: "pointer", color: "var(--c-gray-600)" }}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteApplication(app.id)}
                                                    style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "none", background: "#FFF5F5", cursor: "pointer", color: "#E53E3E" }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <div 
                        onClick={() => setSelectedApp(null)}
                        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                    />
                    <div style={{ 
                        position: "relative", width: "100%", maxWidth: "800px", 
                        background: "white", borderRadius: "2rem", overflow: "hidden",
                        display: "flex", flexDirection: "column", maxHeight: "90vh"
                    }}>
                        {/* Header */}
                        <div style={{ padding: "2rem", borderBottom: "1px solid var(--c-gray-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "1.5rem", background: "var(--c-soft-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-jci-blue)" }}>
                                    <User size={32} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>{selectedApp.fullName}</h2>
                                    <p style={{ color: "var(--c-gray-500)" }}>Application submitted on {new Date(selectedApp.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedApp(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-gray-400)" }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: "2rem", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 300px", gap: "3rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <section>
                                    <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-gray-400)", marginBottom: "1rem" }}>Motivation & Bio</h3>
                                    <p style={{ lineHeight: 1.6, color: "var(--c-gray-700)", whiteSpace: "pre-wrap" }}>
                                        {selectedApp.motivation || "No motivation provided."}
                                    </p>
                                </section>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                    <section>
                                        <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-gray-400)", marginBottom: "1rem" }}>Skills</h3>
                                        <p style={{ color: "var(--c-gray-700)" }}>{selectedApp.skills || "N/A"}</p>
                                    </section>
                                    <section>
                                        <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-gray-400)", marginBottom: "1rem" }}>Interests</h3>
                                        <p style={{ color: "var(--c-gray-700)" }}>{selectedApp.interests || "N/A"}</p>
                                    </section>
                                </div>
                            </div>

                            <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <section style={{ background: "var(--c-gray-50)", padding: "1.5rem", borderRadius: "1.25rem" }}>
                                    <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-gray-400)", marginBottom: "1.5rem" }}>Contact Details</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem" }}>
                                            <Mail size={16} color="var(--c-jci-blue)" /> {selectedApp.email}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem" }}>
                                            <Phone size={16} color="var(--c-jci-blue)" /> {selectedApp.phone}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem" }}>
                                            <BookOpen size={16} color="var(--c-jci-blue)" /> {selectedApp.fieldOfStudy || "N/A"}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-gray-400)", marginBottom: "1.5rem" }}>Update Status</h3>
                                    <div style={{ display: "grid", gap: "0.5rem" }}>
                                        {statuses.filter(s => s !== "All").map(status => {
                                            const info = getStatusStyle(status);
                                            const isActive = selectedApp.status === status;
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => updateStatus(selectedApp.id, status)}
                                                    style={{
                                                        padding: "0.75rem 1rem",
                                                        borderRadius: "0.75rem",
                                                        border: "1px solid",
                                                        borderColor: isActive ? info.color : "var(--c-gray-200)",
                                                        background: isActive ? info.bg : "white",
                                                        color: info.color,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.75rem",
                                                        fontSize: "0.85rem",
                                                        fontWeight: 700,
                                                        cursor: "pointer",
                                                        transition: "all 0.2s"
                                                    }}
                                                >
                                                    {info.icon} {status}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </section>
                            </aside>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: "1.5rem 2rem", background: "var(--c-gray-50)", borderTop: "1px solid var(--c-gray-100)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button 
                                onClick={() => deleteApplication(selectedApp.id)}
                                style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)", border: "1px solid #FED7D7", background: "white", color: "#C53030", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
                            >
                                Delete Application
                            </button>
                            <button 
                                onClick={() => setSelectedApp(null)}
                                className="btn btn-primary"
                                style={{ padding: "0.75rem 2rem", height: "auto", fontSize: "0.9rem" }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .table-row-hover:hover {
                    background-color: var(--c-gray-50) !important;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
