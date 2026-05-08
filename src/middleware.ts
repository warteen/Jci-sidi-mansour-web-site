import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Ensure we only protect /admin routes, but skip /admin/login
    if (path.startsWith('/admin') && path !== '/admin/login') {
        const token = req.cookies.get('admin_token')?.value;

        // Redirect to login if no token is found
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        try {
            // If JWT_SECRET is missing, we must fail closed
            if (!process.env.JWT_SECRET) {
                console.error("CRITICAL: JWT_SECRET environment variable is missing.");
                return NextResponse.redirect(new URL('/admin/login', req.url));
            }

            // Verify the JWT signature securely using jose (Edge-compatible)
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);

            // Token is valid, proceed
            return NextResponse.next();
        } catch (error) {
            // Token is invalid, expired, or tampered with.
            // Redirect to login and clear the bad cookie.
            console.warn(`[AUTH] Invalid or expired token detected for path: ${path}`);
            const response = NextResponse.redirect(new URL('/admin/login', req.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

// Only run middleware on /admin and its subpaths
export const config = {
    matcher: ['/admin/:path*'],
};
