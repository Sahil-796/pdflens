import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bars/app-sidebar";
import StickyBanner from "@/components/ui/sticky-banner";
import { X } from "lucide-react";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <nav className="flex h-screen w-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <StickyBanner hideOnScroll={true}>
                        <span>
                            Verify your email to unlock all features!{" "} <strong>Verify Now</strong>
                        </span>
                    </StickyBanner>
                    <main className="flex-1 overflow-auto bg-background text-foreground">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </nav>
    );
}