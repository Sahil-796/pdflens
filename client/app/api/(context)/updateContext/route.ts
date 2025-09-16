//this is updating context files. it will be called when user adds 2nd context file or onwards

import { addContextFile } from "@/db/context"
import { NextResponse } from "next/server"
import { z } from "zod"

const UpdateContextSchema = z.object({
    pdfname: z.string().min(1),
    userId: z.string().min(1),
    file: z.instanceof(File, { message: "file must be a File" }),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = UpdateContextSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request"},
                { status: 400 }
            )
        }
        
        const { pdfname, userId, file } = parsed.data
        const updatedContext = await addContextFile(pdfname, userId, file.name)
        return NextResponse.json({updatedContext})
    } catch (err) {
        return NextResponse.json({ error: `Context not updated : ${err}` }, { status: 500 })
    }
}
