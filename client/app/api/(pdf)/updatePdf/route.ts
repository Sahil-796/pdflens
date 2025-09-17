import { NextResponse } from 'next/server'
import { updatePdf } from '@/db/pdfs'
import { z } from 'zod'

const UpdatePdfSchema = z.object({
    id: z.string().min(1),
    html: z.string().nullable().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const parsed = UpdatePdfSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }

        const { id, html } = parsed.data
        const html_content = html ?? ''
        const updatedPdf = updatePdf(id, html_content)

        return NextResponse.json(updatedPdf)
    } catch (err) {
        return NextResponse.json({ error: `Pdf not updated : ${err}` }, { status: 500 })
    }
}