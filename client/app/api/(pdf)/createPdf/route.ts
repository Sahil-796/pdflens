import { NextResponse } from 'next/server'
import { createPdf } from '@/db/pdfs'
import { z } from 'zod'

const CreatePdfSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    pdfName: z.string().min(1),
    html: z.string().nullable().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = CreatePdfSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request', issues: parsed.error.flatten() },
                { status: 400 }
            )
        }
        
        const { id, userId, pdfName, html } = parsed.data
        const html_content = html ?? ''
        const newPdf = createPdf(id, userId, pdfName, html_content)

        return NextResponse.json(newPdf)
    } catch (err) {
        return NextResponse.json({ error: `Pdf not created : ${err}` }, { status: 500 })
    }
}