import { createContextFile } from "@/db/context"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const AddContextSchema = z.object({
  files: z.array(z.any()).nonempty(),
  pdfId: z.string().min(1),
  userId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // get all files
    const files = formData.getAll("files") as File[]
    const pdfId = formData.get("pdfId") as string | null

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = AddContextSchema.safeParse({ files, pdfId, userId })
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000"

    const uploadedFileNames: string[] = []
    const results: any[] = []

    for (const file of parsed.data.files) {
      const forwardData = new FormData()
      forwardData.append("file", file)
      forwardData.append("userId", parsed.data.userId)
      forwardData.append("pdfId", parsed.data.pdfId)

      const response = await fetch(`${PYTHON_URL}/context/upload`, {
        headers: { secret1: process.env.secret as string },
        method: "POST",
        body: forwardData,
      })

      if (!response.ok) {
        throw new Error("Upload to FastAPI failed")
      }

      const result = await response.json()
      results.push(result)

      // save in DB
      await createContextFile(parsed.data.pdfId, file.name)
      uploadedFileNames.push(file.name)
    }

    return NextResponse.json({ results, uploadedFileNames })
  } catch (err) {
    console.error("Upload handler failed:", err)
    return NextResponse.json({ error: "Proxy upload failed" }, { status: 500 })
  }
}