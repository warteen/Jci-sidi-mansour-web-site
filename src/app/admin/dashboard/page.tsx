import { prisma } from "@/lib/prisma";
import HeroImageUploader from "./HeroImageUploader";

export default async function Dashboard() {
    const memberCount = await prisma.member.count();
    const projectCount = await prisma.project.count();
    const galleryCount = await prisma.galleryImage.count();
    const heroImageConfig = await prisma.siteConfig.findUnique({ where: { key: "hero_image" } });
    const heroImageUrl = heroImageConfig?.value || "https://placehold.co/800x1000/003764/FFFFFF?text=JCI+Leadership";

    return (
        <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Dashboard Overview</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <div className="card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ color: "var(--c-gray-500)", marginBottom: "0.5rem", fontSize: "1rem" }}>Total Members</h3>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--c-blue-600)" }}>{memberCount}</p>
                </div>

                <div className="card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ color: "var(--c-gray-500)", marginBottom: "0.5rem", fontSize: "1rem" }}>Total Projects</h3>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--c-gold-500)" }}>{projectCount}</p>
                </div>

                <div className="card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ color: "var(--c-gray-500)", marginBottom: "0.5rem", fontSize: "1rem" }}>Gallery Images</h3>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--c-gray-800)" }}>{galleryCount}</p>
                </div>
            </div>

            <HeroImageUploader currentImageUrl={heroImageUrl} />

            <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Quick Actions</h2>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <a href="/admin/members" className="btn btn-primary">Manage Members</a>
                    <a href="/admin/projects" className="btn btn-outline">Add Project</a>
                </div>
            </div>
        </div>
    );
}
