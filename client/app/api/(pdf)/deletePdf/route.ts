import { NextResponse } from 'next/server'
import { deletePdf } from '@/db/pdfs'
import { auth } from '@/lib/auth'
import z from 'zod'

const deletePdfSchema = z.object({
    pdfId: z.string().min(1)
})

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        const userId = session!.user.id
        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json()
        const parsed = deletePdfSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }
        

        const {pdfId} = parsed.data

        const delPdf = await deletePdf(pdfId, userId)
        return NextResponse.json({delPdf, response: 200})
    } catch (err) {
        return NextResponse.json({ error: `Pdfs not found : ${err}` }, { status: 404 })
    }
}