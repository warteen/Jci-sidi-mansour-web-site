export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
// Note: If you see Prisma type errors here, please restart your IDE's TS server.
import HistoryClient from "./HistoryClient";

export const revalidate = 60; // Revalidate every minute

export default async function HistoryPage() {
    const historyEntries = await prisma.historyEntry.findMany({ orderBy: { year: "asc" } });
    const achievements = await prisma.achievement.findMany({ orderBy: { year: "desc" } });
    const trainers = await prisma.trainer.findMany({ orderBy: { createdAt: "asc" } });

    return (
        <HistoryClient 
            historyEntries={historyEntries} 
            achievements={achievements} 
            trainers={trainers} 
        />
    );
}
