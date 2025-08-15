import { db } from "./client"
import { pdfs } from "./schema"
import { eq, lt, gte, ne } from 'drizzle-orm';


export const createPdf = async(userId: number, fileName: string, htmlContent: string) => {
    try {
        const [newPdf] = await db.insert(pdfs).values({userId, fileName, htmlContent}).returning()
        return newPdf
    } catch (err) {
        throw new Error(`Failed to create pdf : ${err}`)
    }
}

export const getAllPdfs = async(userId: number) => {
    try {
        const [allPdfs] = await db.select().from(pdfs).where(eq(pdfs.userId, userId))
        return allPdfs
    } catch (err) {
        throw new Error(`Failed to get pdfs: ${err}`)
    }
}

export const getPdf = async(pdfId: number) => {
    try {
        const [newPdf] = await db.select().from(pdfs).where(eq(pdfs.id, pdfId))
        return newPdf
    } catch (err) {
        throw new Error(`Failed to get pdf : ${err}`)
    }
}