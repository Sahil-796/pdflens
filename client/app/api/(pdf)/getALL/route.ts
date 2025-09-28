import { NextResponse } from 'next/server'
import { getAllpdf } from '@/db/pdfs'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const limitParam = searchParams.get("limit")
        const limit = limitParam && !isNaN(Number(limitParam))
            ? parseInt(limitParam, 10)
            : undefined

        const session = await auth.api.getSession({ headers: req.headers })
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const allPdfs = await getAllpdf(session.user.id, limit)
        return NextResponse.json(allPdfs)
    } catch (err) {
        console.error("Error fetching PDFs:", err)
        return NextResponse.json(
            { error: `Internal server error` },
            { status: 500 }
        )
    }
}