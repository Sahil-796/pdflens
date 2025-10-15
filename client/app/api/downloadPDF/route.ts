import { NextResponse } from "next/server"
import { chromium } from "playwright"
import { z } from "zod"

const HtmlSchema = z.object({
    html: z.string().min(1, "HTML is required"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const parsed = HtmlSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request", issues: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { html } = parsed.data


        const styledHTML = `
      <html>
        <head>
          <style>
            /* 1. Define the page size and margins */
            @page { 
                size: A4; 
                margin: 0.8in; /* Use a consistent margin */
            }

            body { font-family: sans-serif; }

           /* Page-break helper emitted by renderer */
           .pg-break { display:block; page-break-before: always; break-before: page; height:0; margin:0; padding:0; }
            /* Page-break helper emitted by renderer */

            /* 2. Define print-specific rules */
            @media print {
                /* Prevent a page break immediately AFTER a heading */
                h1, h2, h3, h4, h5, h6 { 
                    page-break-after: avoid; 
                }

                /* Add this rule to prevent a page break immediately BEFORE a heading */
                h2, h3, h4, h5, h6 {
                    page-break-before: avoid;
                }

            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `

        const browser = await chromium.launch()
        const page = await browser.newPage()
        await page.setContent(styledHTML, { waitUntil: "networkidle" })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true, 
        })
        await browser.close()

        return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="document.pdf"`,
            },
        })
    } catch (err) {
        console.error("PDF generation error:", err)
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
    }
}