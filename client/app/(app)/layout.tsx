import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser()
    if (!user) redirect('/')
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className="antialiased">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                    >
                        <div className="flex h-screen w-screen">
                            {/* Sidebar is always visible for (app) routes */}
                            <Sidebar />

                            {/* Main content area */}
                            <main className="flex-1 overflow-auto bg-background text-foreground">
                                {children}
                            </main>
                        </div>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}