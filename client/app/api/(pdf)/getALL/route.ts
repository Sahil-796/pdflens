import { NextResponse } from 'next/server'
import { getAllpdf } from '@/db/pdfs'



export async function GET(req: Request) {
    try {

        const userId = req.headers.get("x-user-id")

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const allPdfs = getAllpdf(userId)

        return NextResponse.json(allPdfs)
    } catch (err) {
        return NextResponse.json({ error: `Pdfs not found : ${err}` }, { status: 404 })
    }
}