export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({ orderBy: { year: "desc" } });
        return NextResponse.json(achievements);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, year, description, imageUrl } = await req.json();
        if (!title || !year) return NextResponse.json({ error: "Title and year are required" }, { status: 400 });
        const achievement = await prisma.achievement.create({ data: { title, year, description, imageUrl } });
        revalidatePath('/history');
        return NextResponse.json(achievement);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, title, year, description, imageUrl } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const achievement = await prisma.achievement.update({ where: { id }, data: { title, year, description, imageUrl } });
        revalidatePath('/history');
        return NextResponse.json(achievement);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.achievement.delete({ where: { id } });
        revalidatePath('/history');
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
