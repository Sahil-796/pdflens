import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ranges = formData.get("ranges") as string;

    if (!file || !ranges) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const res = await fetch(`${PYTHON_URL}/tools/split_pdf_by_range`, {
      method: "POST",
      headers: {
        secret1: process.env.secret as string,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { message: "Conversion Failed", error: errorText },
        { status: res.status },
      );
    }

    const contentType =
      res.headers.get("Content-Type") || "application/octet-stream";

    const isZip = ranges.includes(",");
    const fallbackExt = isZip ? ".zip" : ".pdf";
    const fallbackFilename = `split_files${fallbackExt}`;

    const contentDisposition =
      res.headers.get("Content-Disposition") ||
      `attachment; filename="${fallbackFilename}"`;

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
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
