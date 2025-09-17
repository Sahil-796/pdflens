import { NextResponse } from 'next/server'
import { getPdf } from '@/db/pdfs'
import { z } from 'zod'

const GetPdfSchema = z.object({
    pdfId: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = GetPdfSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }
        
        const { pdfId } = parsed.data
        const pdf = getPdf(pdfId)

        return NextResponse.json(pdf)
    } catch (err) {
        return NextResponse.json({ error: `Pdf not found : ${err}` }, { status: 404 })
    }
}