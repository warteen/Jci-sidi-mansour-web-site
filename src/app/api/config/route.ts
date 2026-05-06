import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const { key, value } = await req.json();
        if (!key || !value) return NextResponse.json({ error: "Key and value required" }, { status: 400 });
        
        const config = await prisma.siteConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        revalidatePath('/');
        return NextResponse.json(config);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
