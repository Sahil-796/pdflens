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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        {/* Required core tags */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <title>ZendraPdf — AI PDF Generator</title>

        <meta
          name="description"
          content="AI PDF Generator: Create, edit, and manage your PDFs with AI-powered simplicity. Fast, smart, and easy document handling."
        />
        <meta
          name="keywords"
          content="AI PDF Generator, PDF editor, ZendraPdf, PDF Generator, AI document editor, create PDF, edit PDF"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://zendrapdf.app" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* OpenGraph */}
        <meta property="og:title" content="ZendraPdf — AI PDF Generator" />
        <meta
          property="og:description"
          content="AI PDF Generator: Create, edit, and manage your PDFs with AI-powered simplicity."
        />
        <meta property="og:url" content="https://zendrapdf.app" />
        <meta property="og:site_name" content="ZendraPdf — AI PDF Generator" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content="https://zendrapdf.app/icon.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ZendraPdf — AI PDF Generator" />
        <meta
          name="twitter:description"
          content="Create, edit, and manage PDFs with AI-powered simplicity."
        />
        <meta name="twitter:image" content="https://zendrapdf.app/icon.png" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Preload hero image if you have 👇 */}
        {/* <link rel="preload" as="image" href="/hero.png" /> */}

        {/* Structured Data */}
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

        <Analytics />
      </body>
    </html>
  );
}
