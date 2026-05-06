import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request, props: { params: Promise<{ filename: string }> }) {
    try {
        const { filename } = await props.params;
        const uploadDir = path.join(process.cwd(), "storage/uploads");
        const filepath = path.join(uploadDir, filename);

        try {
            const fileBuffer = await fs.readFile(filepath);
            // Quick content-type guess
            const ext = filename.split('.').pop()?.toLowerCase();
            let contentType = "application/octet-stream";
            if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
            else if (ext === "png") contentType = "image/png";
            else if (ext === "gif") contentType = "image/gif";
            else if (ext === "webp") contentType = "image/webp";
            else if (ext === "svg") contentType = "image/svg+xml";

            return new NextResponse(fileBuffer, {
                headers: { "Content-Type": contentType }
            });
        } catch (e) {
            return new NextResponse("File not found", { status: 404 });
        }
    } catch (e: any) {
        return new NextResponse("Error: " + e.message, { status: 500 });
    }
}
