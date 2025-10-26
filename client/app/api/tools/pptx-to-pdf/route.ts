import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get file from request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000'

    // Forward to FastAPI backend
    const res = await fetch(`${PYTHON_URL}/tools/pptx_to_pdf`, {
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
        { status: res.status }
      );
    }

    // Convert backend response (PDF Blob)
    const pdfBuffer = await res.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: res.headers
    });
  } catch (error: any) {
    console.error("Error in route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
