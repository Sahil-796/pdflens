import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZendraPdf — AI PDF Generator",
  description:
    "AI PDF Generator: Create, edit, and manage your PDFs with ZendraPdf. AI-powered simplicity for smarter document handling.",
  metadataBase: new URL("https://zendrapdf.vercel.app"),
  alternates: { canonical: "https://zendrapdf.vercel.app" },
  icons: { icon: "/icon.png" }, 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZendraPdf",
    url: "https://zendrapdf.vercel.app",
    logo: "https://zendrapdf.vercel.app/icon.png",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* REQUIRED FIRST */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* title + meta description should be early */}
        <title>ZendraPdf — AI PDF Generator</title>
        <meta
          name="description"
          content="AI PDF Generator to create, edit, and manage PDFs with AI-powered simplicity."
        />

        {/* favicon - MUST BE .ico */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://zendrapdf.vercel.app" />

        {/* structured data MUST come after meta tags */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>
            {children}
            <Toaster position="top-center" richColors />
          </CommandPaletteProvider>
        </ThemeProvider>

        {/* 🚀 MUST BE INSIDE BODY, NEVER ABOVE HEAD */}
        <Analytics />
      </body>
    </html>
  );
}
