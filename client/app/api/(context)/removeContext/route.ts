import { removeContextFile } from "@/db/context"
import { NextResponse } from "next/server"
import { z } from "zod"

const RemoveContextSchema = z.object({
    filename: z.string().min(1),
    userId: z.string().min(1),
    pdfId: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = RemoveContextSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request'},
                { status: 400 }
            )
        }
        
        const { userId, pdfId, filename } = parsed.data
        const updated = removeContextFile(pdfId, userId, filename)

        return NextResponse.json(updated)
    } catch (err) {
        return NextResponse.json({ error: `Pdf not removed : ${err}` }, { status: 500 })
    }
}