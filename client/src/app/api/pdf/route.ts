import { NextResponse } from "next/server"
import { createPdf } from "@/db/pdfs"
import { v4 as uuidv4 } from 'uuid'
import { z } from "zod";

const createPdfSchema = z.object({
  userId: z.uuid(),
  filename: z.string().min(1),
  htmlContent: z.string(),
});

type CreatePdfRequest = z.infer<typeof createPdfSchema>; 


export async function POST(req: Request) {
    
    try {

        const body = await req.json();
        const parsed: CreatePdfRequest = createPdfSchema.parse(body)
        const pdfId = uuidv4()

        const pdf = await createPdf(pdfId, parsed.userId, parsed.filename, parsed.htmlContent)

        return NextResponse.json({message: "Pdf created successfully", pdf})
    } catch (err) {
       if (err instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: err.issues },
                { status: 400 }
            );
            }

    console.error("Error creating PDF:", err);
    return NextResponse.json(
      { error: "Failed to create Pdf" },
      { status: 500 }
    )
}

}