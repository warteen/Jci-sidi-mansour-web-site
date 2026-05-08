export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

// Basic in-memory rate limiting to protect against brute-force attacks
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    // Clean up old entries periodically
    if (loginAttempts.size > 1000) {
        for (const [key, val] of loginAttempts.entries()) {
            if (now - val.timestamp > RATE_LIMIT_WINDOW_MS) {
                loginAttempts.delete(key);
            }
        }
    }

    if (!attempt) {
        loginAttempts.set(ip, { count: 1, timestamp: now });
        return false;
    }

    if (now - attempt.timestamp > RATE_LIMIT_WINDOW_MS) {
        // Window expired, reset
        loginAttempts.set(ip, { count: 1, timestamp: now });
        return false;
    }

    if (attempt.count >= MAX_ATTEMPTS) {
        return true;
    }

    attempt.count += 1;
    loginAttempts.set(ip, attempt);
    return false;
}

export async function POST(req: Request) {
    try {
        // 1. Basic Rate Limiting Check
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown-ip";
        if (checkRateLimit(ip)) {
            console.warn(`[AUTH] Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                { status: 429, headers: { "Cache-Control": "no-store" } }
            );
        }

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400, headers: { "Cache-Control": "no-store" } }
            );
        }

        // 2. Fetch Admin from Database
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            console.warn(`[AUTH] Failed login attempt (User Not Found) for email: ${email} from IP: ${ip}`);
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401, headers: { "Cache-Control": "no-store" } }
            );
        }

        // 3. Verify Password
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            console.warn(`[AUTH] Failed login attempt (Invalid Password) for email: ${email} from IP: ${ip}`);
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401, headers: { "Cache-Control": "no-store" } }
            );
        }

        // 4. JWT Security Validation
        if (!process.env.JWT_SECRET) {
            throw new Error("CRITICAL: JWT_SECRET environment variable is missing.");
        }

        // 5. Generate Secure JWT Token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: admin.id, email: admin.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret);

        // Reset rate limit upon successful login
        loginAttempts.delete(ip);
        console.info(`[AUTH] Successful login for email: ${email} from IP: ${ip}`);

        // 6. Set Secure Cookie and Send Response
        const response = NextResponse.json(
            { success: true },
            { headers: { "Cache-Control": "no-store" } }
        );

        response.cookies.set({
            name: 'admin_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (err: any) {
        // Prevent leaking sensitive server errors
        console.error(`[AUTH] Internal Server Error:`, err);
        return NextResponse.json(
            { error: "An unexpected error occurred during authentication. Please try again later." },
            { status: 500, headers: { "Cache-Control": "no-store" } }
        );
    }
}
