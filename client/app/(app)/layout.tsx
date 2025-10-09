import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bars/app-sidebar";
import StickyBanner from "@/components/ui/sticky-banner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

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
                        <div className="flex items-center justify-center gap-2">
                            <span>Please check your email to verify your accout.</span>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">Resend Email</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Verification Email</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            We have sent you a new verification email, please check both your inbox and spam folder.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </StickyBanner>
                    <main className="flex-1 overflow-auto bg-background text-foreground">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </nav>
    );
}