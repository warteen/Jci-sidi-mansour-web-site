import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const adminCount = await prisma.admin.count();
        if (adminCount > 0) return NextResponse.json({ message: "Already seeded" });

        await prisma.admin.create({
            data: {
                email: 'admin@jcisidimansour.com',
                password: await bcrypt.hash('admin123', 10),
            }
        });

        await prisma.stat.createMany({
            data: [
                { key: 'members', value: 50 },
                { key: 'projects', value: 120 },
                { key: 'years', value: 15 },
            ]
        });

        await prisma.member.createMany({
            data: [
                { name: 'Ahmed Ben Ali', role: 'President', description: 'Leading the organization.', photoUrl: null },
                { name: 'Yasmine Trabelsi', role: 'VP PRE', description: 'Managing relations and events.', photoUrl: null },
                { name: 'Karim Gharbi', role: 'VP F&D', description: 'Financial planning and development.', photoUrl: null }
            ]
        });

        await prisma.project.create({
            data: {
                title: 'Youth Leadership Program',
                description: 'A 3-month program helping students build their leadership skills.',
                date: new Date(),
                imageUrl: null,
            }
        });

        await prisma.galleryImage.create({
            data: {
                title: 'Annual Forum 2025',
                category: 'Forum',
                imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
                description: null,
            }
        });

        return NextResponse.json({ message: "Database seeded successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
