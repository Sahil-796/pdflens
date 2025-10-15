import { deduceCredits } from "@/db/credits"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const GenerateSchema = z.object({
    userPrompt: z.string().min(1),
    html: z.string().min(1),
    pdfId: z.string(),
    isContext: z.boolean(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = GenerateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request"},
                { status: 400 }
            )
        }

        const { userPrompt, pdfId, isContext, html } = parsed.data
        const session = await auth.api.getSession({ headers: req.headers })
        const userId = session!.user.id

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const creditsLeft = await deduceCredits(userId, 1)

        const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000'
        const res = await fetch(`${PYTHON_URL}/ai/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "secret1": process.env.secret as string
            },
            body: JSON.stringify({
                userPrompt,
                html,
                pdfId, 
                isContext,
                userId
            })
        })
        if (!res.ok) {
            return NextResponse.json({ error: "Python API failed" }, { status: res.status })
        }
        const data = await res.json()
        return NextResponse.json({data, creditsLeft, status: 200})
    } catch (err) {
        console.error("API Error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
