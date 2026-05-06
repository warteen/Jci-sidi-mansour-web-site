import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const members = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
        return NextResponse.json(members);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, role, description, photoUrl } = await req.json();
        if (!name || !role) return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
        const member = await prisma.member.create({ data: { name, role, description, photoUrl } });
        revalidatePath('/');
        return NextResponse.json(member);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, name, role, description, photoUrl } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const member = await prisma.member.update({ where: { id }, data: { name, role, description, photoUrl } });
        revalidatePath('/');
        return NextResponse.json(member);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.member.delete({ where: { id } });
        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
