import { addContextFile } from "@/db/context"
import { NextResponse } from "next/server"
import { z } from "zod"

const UpdateContextSchema = z.object({
  pdfId: z.string().min(1),
  userId: z.string().min(1),
  file: z.instanceof(File, { message: "file must be a File" }),
})

export async function POST(req: Request) {
  try {
    // Parse form-data
    const formData = await req.formData()

    const file = formData.get("file")
    const userId = formData.get("userId")
    const pdfId = formData.get("pdfId")

    const parsed = UpdateContextSchema.safeParse({ file, userId, pdfId })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const uploadedFileName = parsed.data.file.name

    // Forward file to FastAPI for embedding
    const forwardData = new FormData()
    forwardData.append("file", parsed.data.file)
    forwardData.append("userId", parsed.data.userId)
    forwardData.append("pdfId", parsed.data.pdfId)

    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: forwardData,
    })

    if (!response.ok) {
      throw new Error("Upload to FastAPI failed")
    }

    const result = await response.json()

    // Update context row in DB
    const updatedContext = await addContextFile(
      parsed.data.pdfId,
      uploadedFileName
    )

    return NextResponse.json({ result, updatedContext })
  } catch (err) {
    console.error("Update context handler failed:", err)
    return NextResponse.json({ error: `Context not updated: ${err}` }, { status: 500 })
  }
}
