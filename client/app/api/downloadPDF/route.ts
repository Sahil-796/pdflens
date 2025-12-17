import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";
import { z } from "zod";

const HtmlSchema = z.object({
  html: z.string().min(1, "HTML is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = HtmlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { html } = parsed.data;

    const styledHTML = `
      <html>
        <head>
          <style>
            @page { 
              size: A4; 
              margin: 0.8in; 
            }
            body { font-family: sans-serif; }
            .pg-break { 
              display: block; 
              page-break-before: always; 
              break-before: page; 
              height: 0; 
              margin: 0; 
              padding: 0; 
            }
            @media print {
              h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
              h2, h3, h4, h5, h6 { page-break-before: avoid; }
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;

    const isProduction = process.env.NODE_ENV === "production";

    const localExecutablePath =
      "/Applications/Helium.app/Contents/MacOS/Helium";

    // If running locally, we skip the special serverless args
    const launchOptions = isProduction
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
        }
      : {
          args: [],
          executablePath: localExecutablePath,
          headless: true,
        };

    const browser = await playwright.launch(launchOptions);
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.setContent(styledHTML, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
