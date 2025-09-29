import { removeContextFile } from "@/db/context"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const RemoveContextSchema = z.object({
  filename: z.string().min(1),
  pdfId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RemoveContextSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { pdfId, filename } = parsed.data
    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000"

    const response = await fetch(`${PYTHON_URL}/context/remove`, {
      headers: {
        "Content-Type": "application/json",
        secret1: process.env.secret as string,
      },
      method: "POST",
      body: JSON.stringify({ filename, pdfId, userId }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("Python API error:", errText)
      return NextResponse.json({ error: "Python API failed" }, { status: response.status })
    }

    // update DB record too
    const updated = await removeContextFile(pdfId, filename)

    return NextResponse.json(updated)
  } catch (err) {
    console.error("RemoveContext API error:", err)
    return NextResponse.json({ error: `Pdf not removed: ${err}` }, { status: 500 })
  }
}