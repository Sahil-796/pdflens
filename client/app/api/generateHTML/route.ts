import { deduceCredits } from "@/db/credits"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const GenerateSchema = z.object({
    userPrompt: z.string().min(1),
    pdfId: z.string(),
    isContext: z.boolean(),
})

export async function POST(req: Request) {
  let userId: string | undefined
  let deducted = false
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
        userId = session!.user.id

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const creditsLeft = await deduceCredits(userId, 4)
        deducted = true

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
            try {
                const body = await res.json();
                if (deducted) {
                  await deduceCredits(userId, -4)
                  deducted = false
                }
                return NextResponse.json(
                    { error: body.message || "Python API failed" },
                    { status: res.status }
                );
            } catch {
                // in case Python returns non-JSON error
                if (deducted) {
                  await deduceCredits(userId, -4)
                  deducted = false
                }
                return NextResponse.json(
                  { error: "Python API failed" },
                  { status: res.status }
                )
            }
        }

        const data = await res.json()
        return NextResponse.json({ data, creditsLeft, status: 200 })

    } catch (err) {
        console.error("API Error:", err)
        
      if (userId && deducted) {
        await deduceCredits(userId, -4)
      }

        if (err instanceof Error && err.message.includes("Insufficient credits")) {
            return NextResponse.json(
                { error: "Insufficient credits" },
                { status: 429 }
            )
        }
        return NextResponse.json(
            { success: false, message: (err as Error)?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}