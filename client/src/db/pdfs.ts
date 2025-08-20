import { db } from "./client"
import { users, pdfs } from "./schema"
import { eq, lt, gte, ne, sql } from 'drizzle-orm';


export const createPdf = async(id: string, userId: string, fileName: string, htmlContent: string) => {
    try {
        const [newPdf] = await db.insert(pdfs).values({id, userId, fileName, htmlContent}).returning()

        await db.update(users).set({ 
            pdfIds: sql`array_append(${users.pdfIds}, ${newPdf.id})`,
            pdfNames: sql`array_append(${users.pdfNames}, ${newPdf.fileName})`
        }).where(eq(users.id, userId))
        
        return newPdf
    } catch (err) { 
        throw new Error(`Failed to create pdf : ${err}`)
    }
}

export const getAllPdfs = async(userId: string) => {
    try {
        const [allPdfs] = await db.select().from(pdfs).where(eq(pdfs.userId, userId))
        return allPdfs
    } catch (err) {
        throw new Error(`Failed to get pdfs: ${err}`)
    }
}

export const getPdf = async(pdfId: string) => {
    try {
        const [newPdf] = await db.select().from(pdfs).where(eq(pdfs.id, pdfId))
        return newPdf
    } catch (err) {
        throw new Error(`Failed to get pdf : ${err}`)
    }
}