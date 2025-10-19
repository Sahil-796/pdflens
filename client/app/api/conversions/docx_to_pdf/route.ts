// import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const formData = await req.formData(); // not req.json as this is multipart/formdata - for files
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    //auth check - wrap this into a func
    // const session = await auth.api.getSession({ headers: req.headers });
    // const userId = session?.user?.id;

    // if (!userId || typeof userId !== "string") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    //python server

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const pythonForm = new FormData();
    pythonForm.append("file", file);

    const res = await fetch(`${PYTHON_URL}/tools/docx_to_pdf`, {
      method: "POST",
      headers: {
        secret1: process.env.secret as string,
      },
      body: pythonForm,
    });

    if (!res.ok) {
      let body;
      try {
        body = await res.json();
      } catch {
        body = {};
      }
      return NextResponse.json(
        { error: body.message || "Python API failed" },
        { status: res.status }
      );
    }


    const blob = await res.blob();
    return new Response(blob, {
    status: 200,
    headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=result.pdf",
    },
    });


  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
