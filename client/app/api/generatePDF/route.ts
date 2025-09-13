import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "HTML is required" }, { status: 400 });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Use the HTML string passed by client
    await page.setContent(html, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    
    return NextResponse.json(pdfBuffer);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
