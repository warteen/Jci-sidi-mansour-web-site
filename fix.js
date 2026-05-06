const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if ((content.includes('"use client"') || content.includes("'use client'")) && content.includes("export const dynamic = 'force-dynamic';")) {
        content = content.replace("export const dynamic = 'force-dynamic';\n", "");
        content = content.replace("export const dynamic = 'force-dynamic';", "");
        fs.writeFileSync(fullPath, content);
        console.log("Fixed " + fullPath);
      }
    }
  }
};

walk('./src/app');
