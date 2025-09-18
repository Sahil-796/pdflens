import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const GenerateSchema = z.object({
    userPrompt: z.string().min(1),
    pdfId: z.string(),
    isContext: z.boolean(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = GenerateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request", issues: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { userPrompt, pdfId, isContext } = parsed.data
        const session = await auth.api.getSession({ headers: req.headers })
        const userId = session!.user.id
        const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000'

        const res = await fetch(`${PYTHON_URL}/ai/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "secret1": process.env.secret as string
            },
            body: JSON.stringify({
                userId,
                userPrompt,
                pdfId, 
                isContext
            })
        })
        if (!res.ok) {
            return NextResponse.json({ error: "Python API failed" }, { status: res.status })
        }
        const data = await res.json()
        return NextResponse.json(data)
    } catch (err) {
        console.log("API Error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}