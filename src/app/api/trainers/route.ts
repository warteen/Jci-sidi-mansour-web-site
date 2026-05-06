export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const trainers = await prisma.trainer.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(trainers);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, specialty, bio, photoUrl } = await req.json();
        if (!name || !specialty) return NextResponse.json({ error: "Name and specialty are required" }, { status: 400 });
        const trainer = await prisma.trainer.create({ data: { name, specialty, bio, photoUrl } });
        revalidatePath('/history');
        return NextResponse.json(trainer);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, name, specialty, bio, photoUrl } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const trainer = await prisma.trainer.update({ where: { id }, data: { name, specialty, bio, photoUrl } });
        revalidatePath('/history');
        return NextResponse.json(trainer);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.trainer.delete({ where: { id } });
        revalidatePath('/history');
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
