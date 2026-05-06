import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(images);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, imageUrl, category } = await req.json();
        if (!title || !imageUrl || !category) return NextResponse.json({ error: "Title, imageUrl and category are required" }, { status: 400 });
        const image = await prisma.galleryImage.create({ data: { title, description, imageUrl, category } });
        revalidatePath('/');
        return NextResponse.json(image);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, title, description, imageUrl, category } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const image = await prisma.galleryImage.update({ where: { id }, data: { title, description, imageUrl, category } });
        revalidatePath('/');
        return NextResponse.json(image);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.galleryImage.delete({ where: { id } });
        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
