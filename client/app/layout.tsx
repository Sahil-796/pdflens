import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeStyleProvider } from "@/components/ThemeStyleProvider";
import { Toaster } from "sonner";
import Navbar from "@/components/LandingNavbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PDF Lens",
    description: "PDF Lens - Create, edit, and manage your PDFs with ease.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased DarkVercel`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ThemeStyleProvider>
                        {children}
                        <Toaster />
                    </ThemeStyleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}