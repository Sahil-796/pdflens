import { db } from "./client"
import { context } from "./schema"
import { createPdfPending } from "./pdfs"
import { v4 as uuid } from "uuid"

export const setContext = async (pdfId: string | null, files: string[], userId: string, fileName: string ) => {

    try{
        const newId = uuid()
        
        if (pdfId === null) {
            const newPdf = await createPdfPending(newId, userId, fileName)
            const newContext = await db.insert(context).values({id: newId, pdfId: newPdf.id, files}).returning()
            return newContext
        }
        
        const newContext = await db.insert(context).values({id: newId, pdfId, files}).returning()
        return newContext

    } catch(e){
        console.error("error in setContext: ", e)
    }

}