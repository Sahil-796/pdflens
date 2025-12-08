import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ZendraPdf — AI PDF Generator",
  description:
    "AI PDF Generator: Create, edit, and manage your PDFs with AI-powered simplicity. Fast, smart, and easy document handling.",
  keywords: [
    "AI PDF Generator",
    "PDF editor",
    "ZendraPdf",
    "PDF Generator",
    "AI document editor",
    "create PDF",
    "edit PDF",
  ],
  metadataBase: new URL("https://zendrapdf.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ZendraPdf — AI PDF Generator",
    description:
      "AI PDF Generator: Create, edit, and manage your PDFs with AI-powered simplicity.",
    url: "https://zendrapdf.app",
    siteName: "ZendraPdf — AI PDF Generator",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 500,
        height: 500,
        alt: "ZendraPdf — AI PDF Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZendraPdf — AI PDF Generator",
    description: "Create, edit, and manage PDFs with AI-powered simplicity.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZendraPdf",
    url: "https://zendrapdf.app",
    logo: "https://zendrapdf.app/favicon.ico",
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ZendraPdf — AI PDF Generator",
    url: "https://zendrapdf.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://zendrapdf.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const productData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ZendraPdf — AI PDF Generator",
    applicationCategory: "Utility",
    operatingSystem: "Web",
    url: "https://zendrapdf.app",
    description:
      "AI PDF Generator to create, edit, and manage PDFs with AI-powered simplicity.",
    image: "https://zendrapdf.app/icon.png",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://zendrapdf.app"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
        />
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>

        <Analytics />
      </body>
    </html>
  );
}
