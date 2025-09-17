import { NextResponse } from "next/server"
import { z } from "zod"

const GenerateSchema = z.object({
    user_id: z.string().min(1),
    user_prompt: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const parsed = GenerateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request", issues: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { user_id, user_prompt } = parsed.data
        const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000'

        const res = await fetch(`${PYTHON_URL}/ai/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "secret1": process.env.secret as string
            },
            body: JSON.stringify({
                user_id,
                user_prompt,
                pdfname: "pdfname", //hardcoded for now
                isContext: false
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