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
        { status: 400 }
      );
    }

    const { html } = parsed.data;

    const styledHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4;
        margin: 0.8in;
      }

      body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.65;
        color: black;
        background: white;
      }

      @media print {

        /* Headings should never be orphaned */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          break-after: avoid;
        }

        h1 + p,
        h2 + p,
        h3 + p,
        h4 + p,
        h5 + p,
        h6 + p {
          page-break-before: avoid;
          break-before: avoid;
        }

        /* Never split these blocks */
        table,
        pre,
        code,
        blockquote,
        figure,
        img,
        svg {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /* Lists should stay together */
        ul, ol {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /* Avoid tiny leftovers */
        p {
          orphans: 3;
          widows: 3;
        }
      }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>
`;

    // Launch Chromium (Playwright)
    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Load HTML
    await page.setContent(styledHTML, { waitUntil: "load" });

    // 🔑 THIS IS THE CRITICAL LINE
    await page.emulateMedia({ media: "print" });

    // Generate PDF
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