import { NextResponse } from 'next/server'
import { createPdf } from '@/db/pdfs'
import { z } from 'zod'
import {v4 as uuidv4} from 'uuid'

const CreatePdfSchema = z.object({
    userId: z.string().min(1),
    pdfName: z.string().min(1).optional(),
    html: z.string().nullable().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = CreatePdfSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }
        
        const { userId, pdfName, html } = parsed.data
        const id = uuidv4()
        const html_content = html ?? ''
        const newPdf = createPdf(id, userId, pdfName ?? "untitled", html_content)

        return NextResponse.json(newPdf)
    } catch (err) {
        return NextResponse.json({ error: `Pdf not created : ${err}` }, { status: 500 })
    }
}