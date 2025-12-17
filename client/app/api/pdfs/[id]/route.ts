import { NextResponse } from "next/server";
import { getPdf, updatePdf, deletePdf } from "@/db/pdfs";
import { auth } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  html: z.string().nullable().optional(),
  filename: z.string().min(1).optional(),
});

type Props = {
  params: Promise<{ id: string }>;
};

// GET: Fetch single PDF details
export async function GET(req: Request, { params }: Props) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const pdf = await getPdf(id, session.user.id);

    if (!pdf)
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });

    return NextResponse.json({ pdf });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH: Save HTML or Filename changes
export async function PATCH(req: Request, { params }: Props) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { html, filename } = parsed.data;

    // Only update what is provided
    const updated = await updatePdf(
      id,
      session.user.id,
      filename || "Untitled", // Ensure fallback
      html ?? undefined,
    );

    if (!updated)
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });

    return NextResponse.json({ pdf: updated, message: "Saved" });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove PDF
export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const deleted = await deletePdf(id, session.user.id);

    if (!deleted)
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
