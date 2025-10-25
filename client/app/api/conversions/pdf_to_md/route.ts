// import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const formData = await req.formData(); 

    const file = formData.get("file") as File;


    //auth check - wrap this into a func
    // const session = await auth.api.getSession({ headers: req.headers });
    // const userId = session?.user?.id;

    // if (!userId || typeof userId !== "string") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";
    const pythonForm = new FormData()
    pythonForm.append('file', file)

    const res = await fetch(`${PYTHON_URL}/tools/edit-pdf`, {
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

    const data = await res.json()
    return new Response(data["Md content"], {
    status: res.status,
    })

  } catch (err: any) {
    console.error("API Error:", err)
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}