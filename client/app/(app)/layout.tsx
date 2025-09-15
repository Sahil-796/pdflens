import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <nav className="flex h-screen w-screen">
            {/* Sidebar is always visible for (app) routes */}
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {/* <Sidebar /> */}

                    {/* Main content area */}
                    <main className="flex-1 overflow-auto bg-background text-foreground">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </nav>
    );
}