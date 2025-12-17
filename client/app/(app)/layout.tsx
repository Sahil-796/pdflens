import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bars/app-sidebar";
import AuthGuard from "@/hooks/useAuthGuard";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <nav className="flex h-dvh w-screen">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="flex-1 overflow-auto bg-background text-foreground">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </nav>
    </AuthGuard>
  );
}
