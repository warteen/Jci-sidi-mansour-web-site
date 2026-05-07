"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Image as ImageIcon, Briefcase, Settings, LogOut, UserPlus, Clock, Award, UserCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const navLinks = [
        { href: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { href: "/admin/members", icon: <Users size={20} />, label: "Members" },
        { href: "/admin/projects", icon: <Briefcase size={20} />, label: "Projects" },
        { href: "/admin/gallery", icon: <ImageIcon size={20} />, label: "Gallery" },
        { href: "/admin/history", icon: <Clock size={20} />, label: "History" },
        { href: "/admin/achievements", icon: <Award size={20} />, label: "Achievements" },
        { href: "/admin/trainers", icon: <UserCheck size={20} />, label: "Trainers" },
        { href: "/admin/applications", icon: <UserPlus size={20} />, label: "Applications" },
        { href: "/admin/settings", icon: <Settings size={20} />, label: "Settings" }
    ];

    return (
        <>
            {/* Mobile Header (Hamburger Toggle) */}
            <div className="admin-mobile-header" style={{
                display: "none",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                background: "var(--c-jci-marine)",
                color: "white",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--c-jci-blue)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "0.8rem" }}>
                        JCI
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Admin Panel</span>
                </div>
                <button onClick={toggleSidebar} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="admin-sidebar-overlay"
                        style={{
                            display: "none",
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 90
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside 
                className={`admin-sidebar ${isOpen ? 'open' : ''}`} 
                style={{ 
                    position: "fixed", 
                    height: "100vh", 
                    overflowY: "auto",
                    zIndex: 95,
                    transition: "transform 0.3s ease",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div className="admin-sidebar-brand" style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--c-jci-blue)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "0.8rem" }}>
                        JCI
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Admin Panel</span>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            onClick={closeSidebar}
                            className={`admin-nav-item ${pathname === link.href ? 'active' : ''}`}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", 
                                borderRadius: "8px", color: pathname === link.href ? "var(--c-jci-blue)" : "inherit",
                                background: pathname === link.href ? "var(--c-soft-blue)" : "transparent"
                            }}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                    <Link href="/" className="admin-nav-item" style={{ color: "var(--c-gray-500)", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem" }}>
                        <LogOut size={20} /> Back to Site
                    </Link>
                </div>
            </aside>

            <style jsx global>{`
                .admin-sidebar {
                    width: 250px;
                    background: white;
                    border-right: 1px solid var(--c-gray-200);
                    padding: 2rem 1.5rem;
                }
                .admin-content {
                    margin-left: 250px;
                    padding: 2rem;
                    min-height: 100vh;
                    width: calc(100% - 250px);
                }
                @media (max-width: 1024px) {
                    .admin-sidebar {
                        transform: translateX(-100%);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    .admin-content {
                        margin-left: 0;
                        width: 100%;
                        padding: 1.5rem;
                        padding-top: 5rem; /* Space for mobile header */
                    }
                    .admin-mobile-header {
                        display: flex !important;
                    }
                    .admin-sidebar-overlay {
                        display: block !important;
                    }
                    .admin-sidebar-brand {
                        display: none !important; /* Hide brand inside sidebar on mobile */
                    }
                }
            `}</style>
        </>
    );
}
