import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = file.name.split('.').pop() || 'tmp';
        const filename = `${uniqueSuffix}.${ext}`;
        const uploadDir = path.join(process.cwd(), "storage/uploads");
        
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);

        return NextResponse.json({ url: `/api/images/${filename}` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
