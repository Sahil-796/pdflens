import { NextResponse } from 'next/server'
import { createPdf } from '@/db/pdfs'
import { z } from 'zod'
import {v4 as uuidv4} from 'uuid'
import { auth } from '@/lib/auth'

const CreatePdfSchema = z.object({
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
        
        const { pdfName, html } = parsed.data
        const session = await auth.api.getSession({ headers: req.headers })
        const userId = session!.user.id
        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const id = uuidv4()
        const html_content = html ?? ''
        await createPdf(id, userId, pdfName ?? "Untitled", html_content)

        return NextResponse.json({id, status: 200})
    } catch (err) {
        return NextResponse.json({ error: `Pdf not created : ${err}` }, { status: 500 })
    }
}