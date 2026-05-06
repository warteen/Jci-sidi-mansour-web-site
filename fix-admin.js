const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fix() {
    const hash = await bcrypt.hash('admin123', 10);

    // Check if admin exists
    const admin = await prisma.admin.findUnique({ where: { email: 'admin@jcisidimansour.com' } });
    console.log('Admin found:', admin ? 'YES' : 'NO');

    if (admin) {
        await prisma.admin.update({
            where: { email: 'admin@jcisidimansour.com' },
            data: { password: hash }
        });
        console.log('Password reset to: admin123');
    } else {
        await prisma.admin.create({
            data: { email: 'admin@jcisidimansour.com', password: hash }
        });
        console.log('Admin created with password: admin123');
    }

    // Verify
    const updated = await prisma.admin.findUnique({ where: { email: 'admin@jcisidimansour.com' } });
    const valid = await bcrypt.compare('admin123', updated.password);
    console.log('Password verification:', valid ? 'PASS ✓' : 'FAIL ✗');

    await prisma.$disconnect();
}

fix().catch(e => { console.error(e); process.exit(1); });
