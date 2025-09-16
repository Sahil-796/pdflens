import { addContextFile } from "@/db/context"
import { NextResponse } from "next/server"
import { z } from "zod"

const AddContextSchema = z.object({
    file: z.instanceof(File, { message: "file must be a File" }),
    userId: z.string().min(1),
    pdfname: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const formData = await req.formData()

        const file = formData.get("file") as File | null
        const userId = formData.get("userId") as string | null
        const pdfname = formData.get("pdfname") as string | null

        const parsed = AddContextSchema.safeParse({ file, userId, pdfname })
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            )
        }

        const forwardData = new FormData()
        forwardData.append("file", parsed.data.file)
        forwardData.append("userId", parsed.data.userId)
        forwardData.append("pdfname", parsed.data.pdfname)

        const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: forwardData,
        })

        const result = await response.json()
        const newContext = await addContextFile(parsed.data.pdfname, parsed.data.userId, parsed.data.file.name)
        return NextResponse.json({result, newContext})
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Proxy upload failed" }, { status: 500 })
    }
}