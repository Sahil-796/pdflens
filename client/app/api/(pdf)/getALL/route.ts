import { NextResponse } from 'next/server'
import { getAllpdf } from '@/db/pdfs'
import { auth } from '@/lib/auth'



export async function GET(req: Request) {
    try {

        const session = await auth.api.getSession({ headers: req.headers })
        const userId = session!.user.id
        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const allPdfs = await getAllpdf(userId)
        return NextResponse.json(allPdfs)
    } catch (err) {
        return NextResponse.json({ error: `Pdfs not found : ${err}` }, { status: 404 })
    }
}