// import { auth } from "@/lib/auth";
import { Schedule } from "framer-motion";
import { NextResponse } from "next/server";



export async function POST(req: Request) {

  try {

    const formData = await req.formData(); 

    const files = formData.getAll("files") as File[];


    // Require at least two files to merge

    if (files.length < 2) {
      return NextResponse.json({ error: "At least two PDF files are required to merge" }, { status: 400 });
    }

    //auth check - wrap this into a func
    // const session = await auth.api.getSession({ headers: req.headers });
    // const userId = session?.user?.id;

    // if (!userId || typeof userId !== "string") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const pythonForm = new FormData()
    files.forEach(f => pythonForm.append("files", f))

    const res = await fetch(`${PYTHON_URL}/tools/merge_pdfs`, {
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

    // Stream upstream response back to client, preserve key headers
    const contentType = res.headers.get("content-type") || "application/pdf";
    const contentDisposition = res.headers.get("content-disposition") || "attachment; filename=merged.pdf"

    return new Response(res.body, {
      status: res.status,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    })


  } catch (err: any) {
    console.error("API Error:", err)
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}