import { createContextFile } from "@/db/context"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const AddContextSchema = z.object({
  file: z.instanceof(File),
  pdfId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    // Parse form data
    const formData = await req.formData()
    const file = formData.get("file")
    const pdfId = formData.get("pdfId")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = AddContextSchema.safeParse({ file, pdfId })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Forward to FastAPI
    const forwardData = new FormData()
    forwardData.append("file", parsed.data.file)
    forwardData.append("pdfId", parsed.data.pdfId)
    forwardData.append("userId", userId)

    const PYTHON_URL = process.env.NEXT_PUBLIC_PYTHON_URL || "http://localhost:8000"

    let response
    try {
      response = await fetch(`${PYTHON_URL}/context/upload`, {
        method: "POST",
        body: forwardData,
        headers: {
          "secret1": process.env.secret || ""
        }
      })
    } catch (networkErr) {
      console.error("Network error when uploading to FastAPI:", networkErr)
      return NextResponse.json({ error: "Failed to reach FastAPI server" }, { status: 502 })
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error("FastAPI upload failed:", errText)
      return NextResponse.json({ error: `FastAPI upload failed: ${errText}` }, { status: response.status })
    }

    const result = await response.json()

    // Store reference in DB
    let newContext
    try {
      newContext = await createContextFile(parsed.data.pdfId, file.name)
    } catch (dbErr) {
      console.error("Failed to store context in DB:", dbErr)
      return NextResponse.json({ error: "File uploaded but failed to save reference in DB" }, { status: 500 })
    }

    return NextResponse.json({ result, newContext })
  } catch (err) {
    console.error("Upload handler failed:", err)
    return NextResponse.json({ error: "Proxy upload failed" }, { status: 500 })
  }
}