import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Image as ImageIcon, Briefcase, Settings, LogOut, UserPlus, Clock, Award, UserCheck } from "lucide-react";
import { headers } from "next/headers";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const headersList = await headers();
    const currentPath = headersList.get("x-invoke-path") || "";

    // Minimal check to avoid sidebar on login page
    const isLoginPage = currentPath.includes("/login");

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}
