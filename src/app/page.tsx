export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function Home() {
  const members = await prisma.member.findMany({ orderBy: { createdAt: 'asc' } });
  const projects = await prisma.project.findMany({ orderBy: { date: 'desc' }, take: 3 });
  const gallery = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });

  const statsList = await prisma.stat.findMany();
  // Safe map to ensure stats exist
  const stats = {
    members: statsList.find(s => s.key === 'members')?.value || 50,
    projects: statsList.find(s => s.key === 'projects')?.value || 120,
    years: statsList.find(s => s.key === 'years')?.value || 15
  };

  const heroImageConfig = await prisma.siteConfig.findUnique({ where: { key: "hero_image" } });
  const heroImage = heroImageConfig?.value || "https://placehold.co/800x1000/003764/FFFFFF?text=JCI+Leadership";

  return <HomeClient members={members} projects={projects} gallery={gallery} stats={stats} heroImage={heroImage} />;
}
