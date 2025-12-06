import { deduceCredits } from "@/db/credits"
import { createPdf, updatePdf, deletePdf } from "@/db/pdfs"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

const GenerateSchema = z.object({
    userPrompt: z.string().min(1),
    fileName: z.string().optional(),
    isContext: z.boolean().optional(),
    existingPdfId: z.string().optional(), // For regenerating/editing existing
})

export async function POST(req: Request) {
    let userId: string | undefined
    let pdfId: string | undefined
    let creditsDeducted = false
    let isNewPdf = false

    try {
        const body = await req.json()
        const parsed = GenerateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request", issues: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { userPrompt, fileName, isContext, existingPdfId } = parsed.data
        const session = await auth.api.getSession({ headers: req.headers })

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        userId = session.user.id

        // 1. Create PDF Entry (if not existing)
        if (existingPdfId) {
            pdfId = existingPdfId
        } else {
            pdfId = uuidv4()
            const name = fileName || "Untitled"
            // Create initial empty PDF
            await createPdf(pdfId, userId, name, "")
            isNewPdf = true
        }

        // 2. Deduce Credits
        console.log(`[V2/Generate] Deducting credits for user ${userId}`)
        const creditsLeft = await deduceCredits(userId, 4)
        creditsDeducted = true

        // 3. Call Python API
        console.log(`[V2/Generate] Calling Python API for PDF ${pdfId}`)
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
                isContext: isContext || false
            })
        })

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}))
            throw new Error(errorBody.message || `Python API failed with status ${res.status}`)
        }

        const data = await res.json()
        const htmlContent = data

        if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.length === 0) {
            console.error("[V2/Generate] Invalid content received from Python:", data)
            throw new Error("Received empty or invalid content from AI generation")
        }

        // 4. Update PDF with Content
        console.log(`[V2/Generate] Received content length: ${htmlContent.length}`)
        console.log(`[V2/Generate] Updating PDF ${pdfId} with content`)
        await updatePdf(pdfId, fileName || "Untitled", htmlContent)

        return NextResponse.json({
            success: true,
            data: htmlContent,
            pdfId,
            creditsLeft,
            status: 200
        })

    } catch (err) {
        console.error("[V2/Generate] Error:", err)

        // ROLLBACK LOGIC
        if (userId && creditsDeducted) {
            try {
                console.log(`[V2/Generate] Refunding credits for user ${userId}`)
                await deduceCredits(userId, -4)
            } catch (refundErr) {
                console.error("[V2/Generate] Failed to refund credits:", refundErr)
            }
        }

        if (userId && pdfId && isNewPdf) {
            try {
                console.log(`[V2/Generate] Deleting failed PDF ${pdfId}`)
                await deletePdf(pdfId, userId)
            } catch (deleteErr) {
                console.error("[V2/Generate] Failed to delete PDF:", deleteErr)
            }
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
        )
    }
}
