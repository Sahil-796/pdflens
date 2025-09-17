import { NextResponse } from 'next/server'
import { getAllpdf } from '@/db/pdfs'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const GetAllSchema = z.object({
    
    userId: z.string().min(1)

})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = GetAllSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }
        
        const { userId } = parsed.data
        const allPdfs = getAllpdf(userId)

        return NextResponse.json(allPdfs)
    } catch (err) {
        return NextResponse.json({ error: `Pdfs not found : ${err}` }, { status: 404 })
    }
}