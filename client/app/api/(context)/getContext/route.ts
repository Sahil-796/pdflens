import { NextResponse } from "next/server"
import { getContextFiles } from "@/db/context"

export async function POST(req: Request) {
    try {
        const { pdfId } = await req.json()

        if (!pdfId) {
            return NextResponse.json({ error: "Missing pdfId" }, { status: 400 })
        }

        const files = await getContextFiles(pdfId)
        return NextResponse.json({ files })
    } catch (err) {
        console.error("Error in getContextFiles API:", err)
        return NextResponse.json({ error: "Failed to fetch context files" }, { status: 500 })
    }
}