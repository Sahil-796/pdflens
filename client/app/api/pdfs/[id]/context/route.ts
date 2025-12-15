import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createContextFile,
  removeContextFile,
  getContextFiles,
  updateContextFile,
} from "@/db/context";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const files = await getContextFiles(id);
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const forwardData = new FormData();
    forwardData.append("file", file);
    forwardData.append("pdfId", id);
    forwardData.append("userId", userId);

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const response = await fetch(`${PYTHON_URL}/context/upload`, {
      method: "POST",
      headers: { secret1: process.env.secret || "" },
      body: forwardData,
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `AI Processing failed: ${errText}` },
        { status: 500 },
      );
    }

    const updated = await updateContextFile(id, file.name);
    if (!updated) await createContextFile(id, file.name);

    return NextResponse.json({ success: true, fileName: file.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { filename } = body;

    if (!filename)
      return NextResponse.json({ error: "Filename required" }, { status: 400 });

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";
    const response = await fetch(`${PYTHON_URL}/context/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        secret1: process.env.secret || "",
      },
      body: JSON.stringify({ filename: filename, pdfId: id, userId }),
    });

    if (!response.ok) {
      console.warn("Python cleanup failed, but proceeding with DB cleanup");
    }

    await removeContextFile(id, filename);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
