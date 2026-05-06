export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({ orderBy: { date: "desc" } });
        return NextResponse.json(projects);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, imageUrl, date } = await req.json();
        if (!title || !description || !date) return NextResponse.json({ error: "Title, description and date are required" }, { status: 400 });
        const project = await prisma.project.create({ data: { title, description, imageUrl, date: new Date(date) } });
        revalidatePath('/');
        return NextResponse.json(project);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, title, description, imageUrl, date } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const project = await prisma.project.update({
            where: { id },
            data: { title, description, imageUrl, date: date ? new Date(date) : undefined }
        });
        revalidatePath('/');
        return NextResponse.json(project);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.project.delete({ where: { id } });
        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
