import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, fieldOfStudy, skills, interests, motivation } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        fullName,
        phone,
        email,
        fieldOfStudy,
        skills,
        interests,
        motivation,
        status: "New",
      },
    });

    return NextResponse.json(application);
  } catch (error: any) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Basic auth check would go here if needed, but we'll assume the admin layout handles it or we'll add middleware later
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "All") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
