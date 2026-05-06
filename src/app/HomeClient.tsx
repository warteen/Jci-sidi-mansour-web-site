"use client";

import { motion, useScroll, useSpring, useTransform, AnimatePresence, useInView, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, ChevronDown } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "@/components/BrandIcons";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollReveal from "@/components/ScrollReveal";
import JoinModal from "@/components/JoinModal";

export default function HomeClient({ members, projects, gallery, stats, heroImage }: any) {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Hero Parallax
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const { left, top, width, height } = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - left) / width - 0.5;
                const y = (e.clientY - top) / height - 0.5;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const heroX = useSpring(mousePosition.x * 40, { stiffness: 50, damping: 20 });
    const heroY = useSpring(mousePosition.y * 40, { stiffness: 50, damping: 20 });
    const heroRotateX = useSpring(mousePosition.y * -10, { stiffness: 50, damping: 20 });
    const heroRotateY = useSpring(mousePosition.x * 10, { stiffness: 50, damping: 20 });

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

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

            {/* Hero Section */}
            <section ref={heroRef} style={{
                position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
                background: "linear-gradient(135deg, #F0F7FF 0%, #FFFFFF 100%)",
                overflow: "hidden", padding: "0", paddingTop: "90px"
            }}>
                {/* Parallax Decorative Elements */}
                <motion.div
                    style={{ 
                        position: "absolute", top: "10%", right: "10%", width: "500px", height: "500px", 
                        borderRadius: "50%", background: "var(--c-jci-blue)", filter: "blur(120px)", zIndex: 1,
                        x: heroX, y: heroY, opacity: 0.15
                    }}
                />
                <motion.div
                    style={{ 
                        position: "absolute", bottom: "5%", left: "5%", width: "400px", height: "400px", 
                        borderRadius: "50%", background: "var(--c-jci-gold)", filter: "blur(120px)", zIndex: 1,
                        x: useTransform(heroX, (v) => -v), y: useTransform(heroY, (v) => -v), opacity: 0.1
                    }}
                />

                <div className="container" style={{ position: "relative", zIndex: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
                        <motion.div
                            initial="hidden" animate="visible" variants={staggerContainer}
                            style={{ 
                                perspective: "1000px"
                            }}
                        >
                            <motion.div 
                                style={{ 
                                    rotateX: heroRotateX, 
                                    rotateY: heroRotateY, 
                                    transformStyle: "preserve-3d" 
                                }}
                            >
                                <motion.div variants={fadeInUp} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 1.5rem", background: "rgba(0, 118, 190, 0.08)", borderRadius: "var(--radius-full)", marginBottom: "2rem", border: "1px solid rgba(0, 118, 190, 0.1)" }}>
                                    <Sparkles size={16} className="text-jci-blue animate-pulse" style={{ color: "var(--c-jci-blue)" }} />
                                    <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                        🚀 New Era of Leadership
                                    </span>
                                </motion.div>
                                <motion.h1 variants={fadeInUp} style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "2.5rem", letterSpacing: "-0.04em", color: "var(--c-jci-marine)" }}>
                                    Impact. <span style={{ color: "var(--c-jci-blue)" }}>Lead.</span> <br />Transform.
                                </motion.h1>
                                <motion.p variants={fadeInUp} style={{ fontSize: "1.25rem", lineHeight: 1.6, color: "var(--c-gray-600)", marginBottom: "3.5rem", maxWidth: "600px" }}>
                                    Join JCI Sidi Mansour, where young active citizens unite to create sustainable positive change. Empowerment starts with a single step.
                                </motion.p>
                                <motion.div variants={fadeInUp} style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsJoinModalOpen(true)}
                                        className="btn btn-primary hover-glow" 
                                        style={{ height: "60px", padding: "0 2.5rem" }}
                                    >
                                        Join Our Movement <ArrowRight size={20} style={{ marginLeft: "0.75rem" }} />
                                    </motion.button>
                                    <motion.a 
                                        whileHover={{ x: 5 }}
                                        href="#about" className="btn btn-outline" style={{ height: "60px", padding: "0 2.5rem" }}
                                    >
                                        Our Story
                                    </motion.a>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <ScrollReveal direction="right" delay={0.4}>
                            <motion.div
                                style={{
                                    position: "relative",
                                    rotateX: useTransform(heroRotateX, (v) => -v),
                                    rotateY: useTransform(heroRotateY, (v) => -v),
                                    transformStyle: "preserve-3d"
                                }}
                                className="animate-float"
                            >
                                <div style={{ 
                                    padding: "1rem", background: "white", borderRadius: "2rem", boxShadow: "var(--shadow-xl)",
                                    transform: "translateZ(50px)"
                                }}>
                                    <img 
                                        src={heroImage} 
                                        alt="Leadership" 
                                        style={{ width: "100%", borderRadius: "1.5rem", display: "block", maxHeight: "1000px", objectFit: "cover" }} 
                                    />
                                </div>
                                {/* Floating Badge */}
                                <motion.div
                                    style={{
                                        position: "absolute", top: "-20px", right: "-20px",
                                        padding: "1.5rem 2rem", background: "var(--c-jci-gold)",
                                        borderRadius: "1rem", color: "white", fontWeight: 800,
                                        boxShadow: "0 10px 30px rgba(212, 175, 55, 0.4)",
                                        transform: "translateZ(80px)"
                                    }}
                                >
                                    EST. 1915
                                </motion.div>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </div>

                <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <ChevronDown size={32} style={{ color: "var(--c-jci-blue)", opacity: 0.5 }} />
                    </motion.div>
                </div>

                {/* Hero Bottom Fade */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "150px", background: "linear-gradient(to top, var(--c-white), transparent)", zIndex: 5 }}></div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: "8rem 0", background: "var(--c-gray-50)", borderTop: "1px solid var(--c-gray-100)", position: "relative", zIndex: 10 }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
                        <AnimatedCounter value={stats.members || 50} label="Active Leaders" suffix="+" />
                        <AnimatedCounter value={stats.projects || 120} label="Impact Projects" suffix="+" />
                        <AnimatedCounter value={stats.years || 15} label="Years of Legacy" prefix="" />
                    </div>
                </div>
            </section>

            {/* About Section - Storytelling Reveal */}
            <section id="about" style={{ background: "var(--c-white)", overflow: "hidden" }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "8rem", alignItems: "center" }}>
                        <ScrollReveal direction="left">
                            <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", display: "block", marginBottom: "1.5rem" }}>Mission & Vision</span>
                            <h2 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "2.5rem", color: "var(--c-jci-marine)", letterSpacing: "-0.02em" }}>Who We Are</h2>
                            <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "var(--c-gray-600)", marginBottom: "3rem" }}>
                                JCI Sidi Mansour is a global network of young active citizens (18-40) dedicated to making a positive difference in their local community and the world. 
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                <motion.div whileHover={{ y: -5 }} className="card-premium" style={{ padding: "2rem" }}>
                                    <h4 style={{ color: "var(--c-jci-blue)", marginBottom: "1rem", fontSize: "1.25rem" }}>Vision</h4>
                                    <p style={{ fontSize: "1rem", color: "var(--c-gray-600)" }}>To be the leading global network of young active citizens.</p>
                                </motion.div>
                                <motion.div whileHover={{ y: -5 }} className="card-premium" style={{ padding: "2rem" }}>
                                    <h4 style={{ color: "var(--c-jci-blue)", marginBottom: "1rem", fontSize: "1.25rem" }}>Mission</h4>
                                    <p style={{ fontSize: "1rem", color: "var(--c-gray-600)" }}>Empowering young people to create positive change.</p>
                                </motion.div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal direction="right" delay={0.2} style={{ position: "relative" }}>
                            <div className="img-zoom-container shadow-premium" style={{ height: "550px" }}>
                                <img src="https://placehold.co/1000x1200/003764/FFFFFF?text=Community+Impact" alt="About JCI" className="img-zoom" />
                            </div>
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                style={{ position: "absolute", bottom: "40px", left: "-40px", padding: "2.5rem", borderRadius: "var(--radius-xl)", background: "var(--c-white)", boxShadow: "var(--shadow-premium)", zIndex: 10 }}
                            >
                                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--c-jci-blue)", display: "block" }}>20+</span>
                                <p style={{ fontSize: "1rem", color: "var(--c-gray-500)", fontWeight: 600 }}>Partners Worldwide</p>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" style={{ background: "var(--c-gray-50)" }}>
                <div className="container">
                    <ScrollReveal className="text-center" style={{ marginBottom: "6rem", margin: "0 auto" }}>
                        <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", display: "block", marginBottom: "1.5rem", textAlign: "center" }}>The Brain Trust</span>
                        <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--c-jci-marine)", letterSpacing: "-0.02em", textAlign: "center" }}>Executive Board</h2>
                        <p style={{ color: "var(--c-gray-500)", marginTop: "1.5rem", maxWidth: "600px", margin: "1.5rem auto 0", fontSize: "1.1rem", textAlign: "center" }}>The visionaries leading our mission this year with passion and excellence.</p>
                    </ScrollReveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "3rem" }}>
                        {members.map((member: any, i: number) => (
                            <ScrollReveal key={member.id} delay={i * 0.1} direction="up">
                                <motion.div
                                    whileHover={{ y: -15 }}
                                    className="card-premium"
                                    style={{
                                        textAlign: "center", padding: "3rem 2rem", position: "relative"
                                    }}
                                >
                                    <div className="img-zoom-container hover-glow" style={{ width: "160px", height: "160px", borderRadius: "50%", margin: "0 auto 2rem", border: "6px solid var(--c-white)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                                        <img src={member.photoUrl || `https://placehold.co/400x400/0076BE/FFFFFF?text=${member.name.split(' ')[0]}`} alt={member.name} className="img-zoom" />
                                    </div>
                                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--c-jci-marine)" }}>{member.name}</h3>
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }}
                                        style={{ display: "inline-block", background: "var(--c-soft-blue)", padding: "0.4rem 1.25rem", borderRadius: "var(--radius-full)", marginBottom: "1.5rem" }}
                                    >
                                        <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{member.role}</span>
                                    </motion.div>
                                    <p style={{ color: "var(--c-gray-500)", fontSize: "1rem", lineHeight: 1.6 }}>{member.description || "Dedicated leader committed to community impact."}</p>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" style={{ background: "var(--c-white)" }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6rem", flexWrap: "wrap", gap: "3rem" }}>
                        <ScrollReveal direction="left">
                            <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", display: "block", marginBottom: "1.5rem" }}>Our Footprint</span>
                            <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--c-jci-marine)", letterSpacing: "-0.02em" }}>Impact Projects</h2>
                        </ScrollReveal>
                        <ScrollReveal direction="right">
                            <motion.button whileHover={{ scale: 1.05 }} className="btn btn-outline" style={{ display: "flex", gap: "0.5rem" }}>
                                View Archive <ExternalLink size={18} />
                            </motion.button>
                        </ScrollReveal>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "3rem" }}>
                        {projects.map((project: any, i: number) => (
                            <ScrollReveal key={project.id} delay={i * 0.1} direction="up">
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="project-card shadow-lg"
                                >
                                    <img src={project.imageUrl || `https://placehold.co/800x600/002A4D/FFFFFF?text=${project.title}`} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <div className="project-overlay">
                                        <span style={{ color: "var(--c-jci-gold)", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>{new Date(project.date).getFullYear()} Edition</span>
                                        <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>{project.title}</h3>
                                        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", lineHeight: 1.6 }}>{project.description}</p>
                                    </div>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" style={{ background: "var(--c-jci-marine)", color: "white" }}>
                <div className="container">
                    <ScrollReveal className="text-center" style={{ marginBottom: "6rem" }}>
                        <span style={{ color: "var(--c-jci-gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", display: "block", marginBottom: "1.5rem", textAlign: "center" }}>Vibrant Community</span>
                        <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "white", textAlign: "center" }}>Memories in Motion</h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "1.5rem", fontSize: "1.1rem", textAlign: "center" }}>A visual journey through our impact and brotherhood.</p>
                    </ScrollReveal>

                    <div className="masonry-gallery">
                        {gallery.map((img: any, i: number) => (
                            <ScrollReveal key={img.id} delay={(i % 3) * 0.1} direction="up">
                                <motion.div
                                    whileHover={{ scale: 1.02, rotate: (i % 2 === 0 ? 1 : -1) }}
                                    className="masonry-item img-zoom-container"
                                    style={{ position: "relative", borderRadius: "1.5rem", cursor: "zoom-in" }}
                                >
                                    <img src={img.imageUrl || `https://placehold.co/600x${400 + (i % 3) * 100}/0076BE/FFFFFF?text=Moment+${i+1}`} alt={img.title} className="img-zoom" />
                                    <div style={{ 
                                        padding: "2rem", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", 
                                        position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" 
                                    }}>
                                        <span style={{ fontSize: "0.75rem", color: "var(--c-jci-gold)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>{img.category}</span>
                                        <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginTop: "0.25rem" }}>{img.title}</p>
                                    </div>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" style={{ background: "var(--c-white)" }}>
                <div className="container">
                    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "8rem" }}>
                        <ScrollReveal direction="left">
                            <span style={{ color: "var(--c-jci-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", display: "block", marginBottom: "1.5rem" }}>Get Involved</span>
                            <h2 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--c-jci-marine)", marginBottom: "2.5rem", letterSpacing: "-0.02em" }}>Connect With Us</h2>
                            <p style={{ color: "var(--c-gray-600)", marginBottom: "4rem", fontSize: "1.1rem", lineHeight: 1.8 }}>Have questions about our initiatives or ready to join the network of young leaders? Reach out and we'll be in touch.</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                                <motion.div whileHover={{ x: 10 }} style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                    <div className="hover-glow" style={{ width: "60px", height: "60px", borderRadius: "16px", background: "var(--c-soft-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-jci-blue)" }}><Mail size={24} /></div>
                                    <div><p style={{ fontWeight: 800, color: "var(--c-jci-marine)" }}>Email Us</p><p style={{ color: "var(--c-gray-500)", fontWeight: 500 }}>hello@jcisidimansour.com</p></div>
                                </motion.div>
                                <motion.div whileHover={{ x: 10 }} style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                    <div className="hover-glow" style={{ width: "60px", height: "60px", borderRadius: "16px", background: "var(--c-soft-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-jci-blue)" }}><Phone size={24} /></div>
                                    <div><p style={{ fontWeight: 800, color: "var(--c-jci-marine)" }}>Call Us</p><p style={{ color: "var(--c-gray-500)", fontWeight: 500 }}>+216 XX XXX XXX</p></div>
                                </motion.div>
                                <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                                    <motion.a 
                                        href="https://www.facebook.com/share/1BB6rExDbn/?mibextid=LQQJ4d" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -5 }} 
                                        style={{ width: "50px", height: "50px", borderRadius: "12px", background: "var(--c-jci-blue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        <Facebook size={20} />
                                    </motion.a>
                                    <motion.a 
                                        href="https://www.instagram.com/jci_sidi_mansour?igsh=MWRiMHd0OTk5ajAydg==" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -5 }} 
                                        style={{ width: "50px", height: "50px", borderRadius: "12px", background: "var(--c-jci-gold)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        <Instagram size={20} />
                                    </motion.a>
                                    <motion.a 
                                        href="https://www.linkedin.com/company/jci-sidi-mansour/" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -5 }} 
                                        style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#0077B5", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        <Linkedin size={20} />
                                    </motion.a>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={0.2}>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="card-premium" style={{ padding: "4rem" }}
                            >
                                <form style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "var(--c-jci-marine)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                                        <input type="text" className="form-input" placeholder="Enter your full name" />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "var(--c-jci-marine)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</label>
                                        <input type="email" className="form-input" placeholder="name@example.com" />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "var(--c-jci-marine)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Message</label>
                                        <textarea rows={5} className="form-input" style={{ resize: "none" }} placeholder="How can we help you?"></textarea>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit" className="btn btn-primary hover-glow" style={{ width: "100%", height: "60px" }}
                                    >
                                        Send Message
                                    </motion.button>
                                </form>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: "var(--c-jci-marine)", padding: "10rem 0 4rem", color: "white", position: "relative" }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "5rem", marginBottom: "6rem" }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <ScrollReveal direction="left">
                                <img src="/logo-white.svg" alt="JCI Sidi Mansour" style={{ height: "70px", marginBottom: "2.5rem" }} 
                                    onError={(e) => { e.currentTarget.src = "https://placehold.co/300x100/0076BE/FFFFFF?text=JCI+Sidi+Mansour"; }} 
                                />
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "450px" }}>
                                    Empowering young active citizens to create sustainable positive change within their communities through leadership, fellowship, and service.
                                </p>
                            </ScrollReveal>
                        </div>
                        <div>
                            <ScrollReveal direction="up" delay={0.2}>
                                <h4 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "2.5rem", color: "var(--c-jci-gold)" }}>Explore</h4>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <li><a href="#about" className="footer-link" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)" }}>Organization</a></li>
                                    <li><a href="#projects" className="footer-link" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)" }}>Our Impact</a></li>
                                    <li><a href="#team" className="footer-link" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)" }}>Leadership</a></li>
                                    <li><a href="#gallery" className="footer-link" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)" }}>Gallery</a></li>
                                </ul>
                            </ScrollReveal>
                        </div>
                        <div>
                            <ScrollReveal direction="up" delay={0.4}>
                                <h4 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "2.5rem", color: "var(--c-jci-gold)" }}>Join Us</h4>
                                <div style={{ display: "flex", gap: "1.5rem" }}>
                                    <motion.a 
                                        href="https://www.facebook.com/share/1BB6rExDbn/?mibextid=LQQJ4d" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, rotate: 10 }} 
                                        className="footer-social-icon"
                                    >
                                        <Facebook size={22} />
                                    </motion.a>
                                    <motion.a 
                                        href="https://www.instagram.com/jci_sidi_mansour?igsh=MWRiMHd0OTk5ajAydg==" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, rotate: -10 }} 
                                        className="footer-social-icon"
                                    >
                                        <Instagram size={22} />
                                    </motion.a>
                                    <motion.a 
                                        href="https://www.linkedin.com/company/jci-sidi-mansour/" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, rotate: 10 }} 
                                        className="footer-social-icon"
                                    >
                                        <Linkedin size={22} />
                                    </motion.a>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                    <div style={{ paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>
                        <p>© {new Date().getFullYear()} JCI Sidi Mansour. All Rights Reserved.</p>
                        <div style={{ display: "flex", gap: "2.5rem" }}>
                            <a href="#" className="footer-link">Privacy Policy</a>
                            <a href="#" className="footer-link">Terms of Service</a>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .footer-link:hover {
                        color: var(--c-jci-gold) !important;
                    }
                `}</style>
            </footer>

            <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
        </main>
    );
}
