import { NextResponse } from 'next/server'
import { updatePdf } from '@/db/pdfs'
import { z } from 'zod'

const UpdatePdfSchema = z.object({
    id: z.string().min(1),
    html: z.string().nullable().optional(),
    filename: z.string().nullable(),
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

        const { id, html, filename } = parsed.data
        const html_content = html ?? ""
        const newFileName = filename ?? "Untitled" 
        const updatedPdf = await updatePdf(id, newFileName, html_content)
        if (!updatedPdf) {
            return NextResponse.json(
                { status: 404, message: "PDF not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ status: 200, message: "PDF generated successfully!" })
    } catch (err) {
        return NextResponse.json({ error: `Pdf not updated : ${err}` }, { status: 500 })
    }
}
