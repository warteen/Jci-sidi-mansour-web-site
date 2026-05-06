import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Image as ImageIcon, Briefcase, Settings, LogOut, UserPlus, Clock, Award, UserCheck } from "lucide-react";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const headersList = await headers();
    const currentPath = headersList.get("x-invoke-path") || "";

    // Minimal check to avoid sidebar on login page
    const isLoginPage = currentPath.includes("/login");

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar" style={{ position: "fixed", height: "100vh", overflowY: "auto" }}>
                <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--c-jci-blue)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "0.8rem" }}>
                        JCI
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Admin Panel</span>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <Link href="/admin/dashboard" className="admin-nav-item">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/members" className="admin-nav-item">
                        <Users size={20} /> Members
                    </Link>
                    <Link href="/admin/projects" className="admin-nav-item">
                        <Briefcase size={20} /> Projects
                    </Link>
                    <Link href="/admin/gallery" className="admin-nav-item">
                        <ImageIcon size={20} /> Gallery
                    </Link>
                    <Link href="/admin/history" className="admin-nav-item">
                        <Clock size={20} /> History
                    </Link>
                    <Link href="/admin/achievements" className="admin-nav-item">
                        <Award size={20} /> Achievements
                    </Link>
                    <Link href="/admin/trainers" className="admin-nav-item">
                        <UserCheck size={20} /> Trainers
                    </Link>
                    <Link href="/admin/applications" className="admin-nav-item">
                        <UserPlus size={20} /> Applications
                    </Link>
                    <Link href="/admin/settings" className="admin-nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>

                <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                    <Link href="/" className="admin-nav-item" style={{ color: "var(--c-gray-500)" }}>
                        <LogOut size={20} /> Back to Site
                    </Link>
                </div>
            </aside>

            <main className="admin-content" style={{ marginLeft: "250px" }}>
                {children}
            </main>
        </div>
    );
}
