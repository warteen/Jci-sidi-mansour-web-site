const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const publicDir = path.join(__dirname, "public/uploads");
  const storageDir = path.join(__dirname, "storage/uploads");

  // Ensure storage dir exists
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Move files
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    for (const file of files) {
      if (file !== '.gitkeep') {
        const oldPath = path.join(publicDir, file);
        const newPath = path.join(storageDir, file);
        fs.renameSync(oldPath, newPath);
      }
    }
  }

  // Migrate DB
  const members = await prisma.member.findMany();
  for (const m of members) {
    if (m.photoUrl && m.photoUrl.startsWith("/uploads/")) {
      await prisma.member.update({
        where: { id: m.id },
        data: { photoUrl: m.photoUrl.replace("/uploads/", "/api/images/") }
      });
    }
  }

  const projects = await prisma.project.findMany();
  for (const p of projects) {
    if (p.imageUrl && p.imageUrl.startsWith("/uploads/")) {
      await prisma.project.update({
        where: { id: p.id },
        data: { imageUrl: p.imageUrl.replace("/uploads/", "/api/images/") }
      });
    }
  }

  const galleryImages = await prisma.galleryImage.findMany();
  for (const g of galleryImages) {
    if (g.imageUrl && g.imageUrl.startsWith("/uploads/")) {
      await prisma.galleryImage.update({
        where: { id: g.id },
        data: { imageUrl: g.imageUrl.replace("/uploads/", "/api/images/") }
      });
    }
  }

  console.log("Migration complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
