// import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const formData = await req.formData(); 

    const file = formData.get("file") as File;
    const exclude = formData.get("exclude") as string;

    
    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";
    const pythonForm = new FormData()
    pythonForm.append('file', file)
    pythonForm.append('exclude', exclude)

    const res = await fetch(`${PYTHON_URL}/tools/split_pdf_by_pages`, {
      method: "POST",
      headers: {
        secret1: (process.env.SECRET1 || process.env.secret) as string,
      },
      body: pythonForm,
    })

    if (!res.ok) {
        let body
        try {
            body = await res.json()
        } catch {
            body = {}
        }
        return NextResponse.json({ error: body.message || "Python API failed" }, { status: res.status })
    }


    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    });


  } catch (err: any) {
    console.error("API Error:", err)
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}