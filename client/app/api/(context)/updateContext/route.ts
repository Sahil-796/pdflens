import { addContextFile, createContextFile } from "@/db/context"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const UpdateContextSchema = z.object({
  pdfId: z.string().min(1),
  file: z.instanceof(File),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const pdfId = formData.get("pdfId")

    if (!file || !(file instanceof File) || !pdfId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const parsed = UpdateContextSchema.safeParse({ file, pdfId })
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const uploadedFileName = parsed.data.file.name

    // Forward file to FastAPI
    const forwardData = new FormData()
    forwardData.append("file", parsed.data.file)
    forwardData.append("userId", userId)
    forwardData.append("pdfId", parsed.data.pdfId)

    const PYTHON_URL = process.env.NEXT_PUBLIC_PYTHON_URL || "http://localhost:8000"

    const response = await fetch(`${PYTHON_URL}/context/upload`, {
      headers: { "secret1": process.env.secret || "" },
      method: "POST",
      body: forwardData,
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("FastAPI upload failed:", errText)
      return NextResponse.json({ error: `FastAPI upload failed: ${errText}` }, { status: 500 })
    }

    const result = await response.json()

    // Check if context exists in DB
    const updatedContext = await addContextFile(parsed.data.pdfId, uploadedFileName).catch(async () => {
      // fallback to createContextFile if row doesn't exist
      return await createContextFile(parsed.data.pdfId, uploadedFileName)
    })

    return NextResponse.json({ result, updatedContext })
  } catch (err) {
    console.error("Update context handler failed:", err)
    return NextResponse.json({ error: `Context not updated: ${err}` }, { status: 500 })
  }
}