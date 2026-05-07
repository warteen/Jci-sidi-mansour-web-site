"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            router.push("/admin/dashboard");
        } else {
            const data = await res.json();
            setError(data.error || "Login failed");
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--c-gray-100)", padding: "1rem" }}>
            <div className="card" style={{ padding: "clamp(1.5rem, 5vw, 3rem)", width: "100%", maxWidth: "450px", background: "white", borderRadius: "1rem", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ width: "48px", height: "48px", background: "var(--c-blue-600)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", margin: "0 auto 1rem", fontSize: "1.2rem" }}>
                        JCI
                    </div>
                    <h1 style={{ fontSize: "1.5rem" }}>Admin Login</h1>
                    <p style={{ color: "var(--c-gray-500)" }}>Sign in to manage the website.</p>
                </div>

                {error && <div style={{ padding: "1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem", height: "50px", fontSize: "1rem" }}>Login</button>
                </form>
            </div>
        </div>
    );
}
