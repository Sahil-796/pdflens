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
    // Parse form-data
    const formData = await req.formData()

    const file = formData.get("file")
    const pdfId = formData.get("pdfId")
    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session!.user.id
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = AddContextSchema.safeParse({ file, userId, pdfId })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const uploadedFileName = parsed.data.file.name

    // Forward to FastAPI
    const forwardData = new FormData()
    forwardData.append("file", parsed.data.file)
    forwardData.append("userId", userId)
    forwardData.append("pdfId", parsed.data.pdfId)

    const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000'

    const response = await fetch(`${PYTHON_URL}/upload`, {
      headers: {
        "secret1": process.env.secret as string
      },
      method: "POST",
      body: forwardData,
    })

    if (!response.ok) {
      throw new Error("Upload to FastAPI failed")
    }

    const result = await response.json()

    // Store reference in DB
    const newContext = await createContextFile(
      parsed.data.pdfId,
      uploadedFileName
    )

    return NextResponse.json({ result, newContext })
  } catch (err) {
    console.error("Upload handler failed:", err)
    return NextResponse.json({ error: "Proxy upload failed" }, { status: 500 })
  }
}