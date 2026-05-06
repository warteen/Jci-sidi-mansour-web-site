const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) { console.log("Already seeded"); return; }

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
            { name: 'Ahmed Ben Ali', role: 'President', description: 'Leading the organization.' },
            { name: 'Yasmine Trabelsi', role: 'VP PRE', description: 'Managing relations and events.' },
            { name: 'Karim Gharbi', role: 'VP F&D', description: 'Financial planning and development.' }
        ]
    });

    await prisma.project.create({
        data: {
            title: 'Youth Leadership Program',
            description: 'A 3-month program helping students build their leadership skills.',
            date: new Date(),
        }
    });

    await prisma.galleryImage.create({
        data: {
            title: 'Annual Forum 2025',
            category: 'Forum',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
        }
    });

    console.log("Database seeded!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
