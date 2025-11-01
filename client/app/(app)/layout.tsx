import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bars/app-sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <nav className="flex h-svh w-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto bg-background text-foreground">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </nav>
  );
}
