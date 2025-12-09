import { NextResponse } from "next/server";
import { getAllPdfs, createPdf } from "@/db/pdfs";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pdfs = await getAllPdfs(session.user.id);
    return NextResponse.json(pdfs);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

const CreatePdfSchema = z.object({
  pdfName: z.string().min(1).optional(),
  html: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = CreatePdfSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { pdfName, html } = parsed.data;
    const id = uuidv4();

    await createPdf(id, session.user.id, pdfName ?? "Untitled", html ?? "");

    return NextResponse.json({ id, status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create PDF" },
      { status: 500 },
    );
  }
}
