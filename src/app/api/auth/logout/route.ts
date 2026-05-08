export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const response = NextResponse.redirect(new URL('/admin/login', req.url));
    response.cookies.delete('admin_token');
    return response;
}

export async function POST(req: Request) {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.delete('admin_token');
    return response;
}
