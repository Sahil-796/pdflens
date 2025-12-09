import { NextResponse } from "next/server";
import { getPdf, updatePdf, deletePdf } from "@/db/pdfs";
import { auth } from "@/lib/auth";
import { z } from "zod";

type Props = {
  params: Promise<{ id: string }>;
};

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
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

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

const UpdateSchema = z.object({
  html: z.string().nullable().optional(),
  filename: z.string().min(1),
});

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

    const updated = await updatePdf(
      id,
      session.user.id,
      filename,
      html ?? undefined,
    );

    if (!updated)
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });

    return NextResponse.json({ pdf: updated, message: "Saved" });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
