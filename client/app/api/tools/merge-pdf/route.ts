import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length < 2) {
      return NextResponse.json(
        { error: "At least two PDF files are required to merge" },
        { status: 400 },
      );
    }

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const res = await fetch(`${PYTHON_URL}/tools/merge_pdfs`, {
      method: "POST",
      headers: {
        secret1: process.env.secret as string,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: "Python API Failed", error: errorText },
        { status: res.status },
      );
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Error in route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
