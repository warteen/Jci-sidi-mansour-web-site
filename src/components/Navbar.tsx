"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/#about" },
        { name: "History", href: "/history" },
        { name: "Team", href: "/#team" },
        { name: "Projects", href: "/#projects" },
        { name: "Gallery", href: "/#gallery" },
        { name: "Contact", href: "/#contact" },
    ];

    return (
        <nav
            className={`transition-all duration-500 navbar-scrolled ${scrolled ? "shadow-xl" : ""}`}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                height: scrolled ? "70px" : "90px",
                background: "var(--c-jci-marine)", /* Always dark mode */
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
        >
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link href="/">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center cursor-pointer"
                    >
                        <img
                            src="/logo-white.svg"
                            alt="JCI Sidi Mansour"
                            style={{
                                height: scrolled ? "65px" : "85px",
                                width: "auto",
                                transition: "all 0.5s ease"
                            }}
                            onError={(e) => {
                                // Fallback for logo if not found
                                e.currentTarget.src = "https://placehold.co/200x80/0076BE/FFFFFF?text=JCI+Sidi+Mansour";
                            }}
                        />
                    </motion.div>
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="desktop-nav">
                    {navLinks.map((link, i) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={link.href}>
                                <span style={{
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    color: "white",
                                    cursor: "pointer",
                                    transition: "all 0.3s"
                                }}
                                    className="nav-link-hover"
                                >
                                    {link.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                        <Link href="/admin">
                            <button className="btn btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>Join Us</button>
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Toggle */}
                <div
                    className="mobile-toggle"
                    style={{
                        cursor: "pointer",
                        display: "none",
                        height: "40px",
                        width: "40px",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ?
                        <X size={28} color="#fff" /> :
                        <Menu size={28} color="#fff" />
                    }
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[99] navbar-scrolled flex flex-col items-center justify-center gap-8 pt-20"
                        style={{ height: "100vh", width: "100vw" }}
                    >
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
                                    {link.name}
                                </span>
                            </Link>
                        ))}
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: "1rem" }}
                            onClick={() => { setMobileMenuOpen(false); window.location.href = "#contact"; }}
                        >
                            Join Us Now
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .desktop-nav {
                    display: flex;
                }
                .nav-link-hover {
                    position: relative;
                }
                .nav-link-hover::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: var(--c-jci-gold);
                    transition: width 0.3s ease;
                }
                .nav-link-hover:hover::after {
                    width: 100%;
                }
                .nav-link-hover:hover {
                    color: var(--c-jci-gold) !important;
                }
                @media (max-width: 991px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-toggle {
                        display: flex !important;
                    }
                }
            `}</style>
        </nav>
    );
}
