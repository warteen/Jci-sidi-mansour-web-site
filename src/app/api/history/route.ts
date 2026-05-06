import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const historyEntries = await prisma.historyEntry.findMany({ orderBy: { year: "asc" } });
        return NextResponse.json(historyEntries);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { year, title, description, imageUrl } = await req.json();
        if (!year || !title || !description) return NextResponse.json({ error: "Year, title, and description are required" }, { status: 400 });
        const entry = await prisma.historyEntry.create({ data: { year, title, description, imageUrl } });
        revalidatePath('/history');
        return NextResponse.json(entry);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, year, title, description, imageUrl } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const entry = await prisma.historyEntry.update({ where: { id }, data: { year, title, description, imageUrl } });
        revalidatePath('/history');
        return NextResponse.json(entry);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.historyEntry.delete({ where: { id } });
        revalidatePath('/history');
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
