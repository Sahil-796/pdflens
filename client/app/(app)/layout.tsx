import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <nav className="flex h-screen w-screen">
            {/* Sidebar is always visible for (app) routes */}
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 overflow-auto bg-background text-foreground">
                {children}
            </main>
        </nav>
    );
}