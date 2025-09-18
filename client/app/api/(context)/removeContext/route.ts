import { removeContextFile } from "@/db/context"
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
            return NextResponse.json(
                { error: 'Invalid request'},
                { status: 400 }
            )
        }
        
        const { pdfId, filename } = parsed.data
        const userId = req.headers.get("userId")

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000'

        const response = await fetch(`${PYTHON_URL}/remove`, {
            headers: {
                "Content-Type": "application/json",
                "secret1": process.env.secret as string
            },
            method: "POST",
            body: JSON.stringify({
                filename,
                pdfId,
                userId
            })
        })
    

        if (!response.ok) {
            return NextResponse.json({ error: "Python API failed" }, { status: response.status })
        }
        const updated = removeContextFile(pdfId, userId, filename)

        return NextResponse.json(updated)
    } catch (err) {
        return NextResponse.json({ error: `Pdf not removed : ${err}` }, { status: 500 })
    }
}