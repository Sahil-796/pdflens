import { db } from "./client"
import { users, pdf, context } from "./schema"
import { createPdfPending } from "./pdfs"
import { eq } from "drizzle-orm"
import { v4 as uuid } from "uuid"

export const setContext = async (pdfId: string, files: string[], userId: string, fileName: string ) => {

    try{
        const newId = uuid()

        const existing = await db.select().from(pdf).where(eq(pdf.id, pdfId))
        if (existing.length > 0) {
            const newContext = await db.insert(context).values({id: newId, pdfId, files}).returning()
            return newContext
        }
        
        const newPdf = await createPdfPending(newId, userId, fileName)
        const newContext = await db.insert(context).values({id: newId, pdfId: newPdf.id, files}).returning()
        return newContext

    } catch(e){
        console.error("error in setContext: ", e)
    }

}