import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools — ZendraPdf",
  description:
    "Choose from multiple PDF tools: convert, edit, organize, merge, and split PDFs easily.",
  alternates: {
    canonical: "https://zendrapdf.vercel.app/tools",
  },
  robots: {
    index: true,    
    follow: true,
  },
  applicationName: "ZendraPdf",
  authors: [{ name: "ZendraPdf Team" }],
  creator: "ZendraPdf",
  publisher: "ZendraPdf",
  openGraph: {
    title: "PDF Tools — ZendraPdf",
    description:
      "Choose from multiple PDF tools: convert, edit, organize, merge, and split PDFs easily.",
    url: "https://zendrapdf.vercel.app/tools",
    siteName: "ZendraPdf",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZendraPdf — AI PDF Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://zendrapdf.vercel.app"),
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools — ZendraPdf",
    description:
      "Choose from multiple PDF tools: convert, edit, organize, merge, and split PDFs easily.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
  },
};
export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 overflow-auto bg-background text-foreground">
            {children}
        </main>
    );
}