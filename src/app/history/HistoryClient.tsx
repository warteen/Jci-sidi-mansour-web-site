"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { Facebook, Instagram, Linkedin } from "@/components/BrandIcons";
import { Award, Clock, Star, Trophy, Users, CheckCircle, Quote } from "lucide-react";

export default function HistoryClient({ historyEntries, achievements, trainers }: any) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <main style={{ background: "var(--c-white)", color: "var(--c-gray-900)" }}>
            <Navbar />

            {/* Scroll Progress Bar */}
            <motion.div
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, height: "4px",
                    background: "var(--c-jci-blue)", transformOrigin: "0%", zIndex: 101, scaleX
                }}
            />

            {/* Header Section */}
            <section style={{ 
                padding: "160px 0 80px", 
                background: "linear-gradient(135deg, #002A4D 0%, #001f3f 100%)",
                position: "relative",
                overflow: "hidden"
            }}>
                <motion.div 
                    style={{ position: "absolute", top: "20%", right: "-10%", width: "400px", height: "400px", background: "var(--c-jci-blue)", filter: "blur(100px)", opacity: 0.3, borderRadius: "50%" }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
                />
                <div className="container" style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
                    <ScrollReveal direction="up">
                        <span style={{ color: "var(--c-jci-gold)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.9rem" }}>Our Journey</span>
                        <h1 style={{ color: "white", fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 900, marginTop: "1rem", marginBottom: "1.5rem" }}>
                            The Legacy of <span style={{ color: "var(--c-jci-blue)" }}>JCI Sidi Mansour</span>
                        </h1>
                        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
                            A history of empowerment, leadership, and community impact. Discover the milestones that shaped our organization and the people who made it possible.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Timeline Section */}
            <section style={{ padding: "8rem 0", background: "var(--c-gray-50)", position: "relative" }}>
                <div className="container">
                    <ScrollReveal className="text-center" style={{ marginBottom: "6rem" }}>
                        <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem" }}>Evolution</span>
                        <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginTop: "1rem" }}>Our Milestones</h2>
                    </ScrollReveal>

                    <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
                        {/* Vertical Line */}
                        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "var(--c-jci-blue)", opacity: 0.2, transform: "translateX(-50%)" }} className="timeline-line"></div>
                        
                        {historyEntries.map((entry: any, i: number) => {
                            const isEven = i % 2 === 0;
                            return (
                                <div key={entry.id} className={`timeline-entry ${isEven ? 'timeline-entry-left' : 'timeline-entry-right'}`} style={{ display: "flex", justifyContent: isEven ? "flex-start" : "flex-end", position: "relative", marginBottom: "4rem", width: "100%" }}>
                                    <div style={{ position: "absolute", left: "50%", top: "0", transform: "translate(-50%, 0)", width: "20px", height: "20px", borderRadius: "50%", background: "var(--c-jci-gold)", border: "4px solid white", zIndex: 2 }} className="timeline-dot"></div>
                                    
                                    <ScrollReveal direction={isEven ? "right" : "left"} style={{ width: "45%" }} className="timeline-content-wrapper">
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="card-premium" style={{ padding: "2rem", position: "relative", background: "white" }}
                                        >
                                            <div style={{ display: "inline-block", padding: "0.4rem 1rem", background: "var(--c-soft-blue)", color: "var(--c-jci-blue)", fontWeight: 800, borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
                                                {entry.year}
                                            </div>
                                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginBottom: "0.75rem" }}>{entry.title}</h3>
                                            <p style={{ color: "var(--c-gray-600)", lineHeight: 1.6 }}>{entry.description}</p>
                                            {entry.imageUrl && (
                                                <div style={{ marginTop: "1.5rem", borderRadius: "1rem", overflow: "hidden" }}>
                                                    <img src={entry.imageUrl} alt={entry.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                                </div>
                                            )}
                                        </motion.div>
                                    </ScrollReveal>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section style={{ padding: "8rem 0", background: "var(--c-white)" }}>
                <div className="container">
                    <ScrollReveal className="text-center" style={{ marginBottom: "6rem" }}>
                        <span style={{ color: "var(--c-jci-gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem" }}>Excellence</span>
                        <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginTop: "1rem" }}>Achievements & Grades</h2>
                    </ScrollReveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2.5rem" }}>
                        {achievements.map((acc: any, i: number) => (
                            <ScrollReveal key={acc.id} delay={i * 0.1} direction="up">
                                <motion.div 
                                    whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)" }}
                                    style={{ background: "white", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--c-gray-100)", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
                                >
                                    <div style={{ position: "absolute", top: "-20px", right: "-20px", color: "var(--c-soft-blue)", opacity: 0.5 }}>
                                        <Trophy size={120} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", position: "relative", zIndex: 2 }}>
                                        {acc.imageUrl ? (
                                            <img src={acc.imageUrl} alt="badge" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%" }} />
                                        ) : (
                                            <div style={{ width: "60px", height: "60px", background: "var(--c-jci-gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                                <Award size={30} />
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontSize: "0.9rem", color: "var(--c-gray-500)", fontWeight: 700 }}>{acc.year}</div>
                                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>{acc.title}</h3>
                                        </div>
                                    </div>
                                    <p style={{ color: "var(--c-gray-600)", lineHeight: 1.6, position: "relative", zIndex: 2 }}>
                                        {acc.description}
                                    </p>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trainers Section */}
            <section style={{ padding: "8rem 0", background: "var(--c-gray-50)" }}>
                <div className="container">
                    <ScrollReveal className="text-center" style={{ marginBottom: "6rem" }}>
                        <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem" }}>Knowledge Sharers</span>
                        <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginTop: "1rem" }}>Our Trainers</h2>
                        <p style={{ fontSize: "1.1rem", color: "var(--c-gray-500)", marginTop: "1rem", maxWidth: "600px", margin: "1rem auto 0" }}>
                            Meet the brilliant minds and experienced formateurs shaping the future leaders of our community.
                        </p>
                    </ScrollReveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "3rem" }}>
                        {trainers.map((trainer: any, i: number) => (
                            <ScrollReveal key={trainer.id} delay={i * 0.1} direction="up">
                                <motion.div 
                                    whileHover={{ y: -15, scale: 1.02 }}
                                    className="card-premium hover-glow"
                                    style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
                                >
                                    <div className="img-zoom-container" style={{ width: "140px", height: "140px", borderRadius: "50%", border: "4px solid var(--c-white)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}>
                                        <img src={trainer.photoUrl || `https://placehold.co/400x400/0076BE/FFFFFF?text=${encodeURIComponent(trainer.name)}`} alt={trainer.name} className="img-zoom" />
                                    </div>
                                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--c-jci-marine)", marginBottom: "0.5rem" }}>{trainer.name}</h3>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--c-soft-blue)", padding: "0.3rem 1rem", borderRadius: "2rem", marginBottom: "1.5rem" }}>
                                        <Star size={14} color="var(--c-jci-blue)" />
                                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--c-jci-blue)" }}>{trainer.specialty}</span>
                                    </div>
                                    <p style={{ color: "var(--c-gray-500)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                        {trainer.bio || "Dedicated trainer and professional shaping minds and inspiring growth."}
                                    </p>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reused Simple Footer */}
            <footer style={{ background: "var(--c-jci-marine)", padding: "4rem 0", color: "white", textAlign: "center" }}>
                <div className="container">
                    <img src="/logo-white.svg" alt="JCI Sidi Mansour" style={{ height: "60px", margin: "0 auto 2rem" }} 
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/300x100/0076BE/FFFFFF?text=JCI+Sidi+Mansour"; }} 
                    />
                    <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "2rem" }}>
                        <a href="#" style={{ color: "white" }}><Facebook size={24} /></a>
                        <a href="#" style={{ color: "white" }}><Instagram size={24} /></a>
                        <a href="#" style={{ color: "white" }}><Linkedin size={24} /></a>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>© {new Date().getFullYear()} JCI Sidi Mansour. All Rights Reserved.</p>
                </div>
            </footer>

            <style jsx>{`
                @media (max-width: 768px) {
                    .timeline-line {
                        left: 20px !important;
                        transform: none !important;
                    }
                    .timeline-dot {
                        left: 20px !important;
                        transform: translate(-50%, 0) !important;
                    }
                    .timeline-entry-left, .timeline-entry-right {
                        justify-content: flex-end !important;
                    }
                    .timeline-content-wrapper {
                        width: calc(100% - 50px) !important;
                    }
                }
            `}</style>
        </main>
    );
}
