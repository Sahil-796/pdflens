import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { z } from "zod";

const HtmlSchema = z.object({
  html: z.string().min(1, "HTML is required"),
});

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = HtmlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten() },
        { status: 400 }
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

    // 👇 Puppeteer version
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required on Vercel
    });
    const page = await browser.newPage();

    await page.setContent(styledHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    return new Response(pdfBuffer, {
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
      { status: 500 }
    );
  }
}
