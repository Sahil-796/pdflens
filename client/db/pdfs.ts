import { db } from "./client"
import { users, pdfs } from "./schema"
import { eq, lt, gte, ne, sql } from 'drizzle-orm';


export const createPdfPending = async (
  id: string,
  userId: string,
  fileName: string,
  htmlContent: string
) => {
  try {
    const [newPdf] = await db
      .insert(pdfs)
      .values({
        id,
        userId,
        fileName,
        htmlContent: "",
        status: "pending",   // always pending on creation
        pdfUrl: null         // null until PDF is generated
      })
      .returning();
    return newPdf

    } catch (err) { 
        throw new Error(`Failed to create pdf : ${err}`)
    }
}

export const updatePdfStatus = async (
  id: string,
  status: "completed" | "failed",
  htmlContent?: string,
  pdfUrl?: string
) => {
  try {
    const [updatedPdf] = await db
      .update(pdfs)
      .set({
        status,
        htmlContent: htmlContent ?? "",
        pdfUrl: pdfUrl ?? null
      })
      .where(eq(pdfs.id, id))
      .returning();

    return updatedPdf;
  } catch (err) {
    throw new Error(`Failed to update PDF: ${(err as Error).message}`);
  }
};


export const getAllPdfs = async(userId: string) => {
    try {
        const [allPdfs] = await db.select().from(pdfs).where(eq(pdfs.userId, userId))
        return [allPdfs]
    } catch (err) {
        throw new Error(`Failed to get pdfs: ${err}`)
    }
}

export const getPdf = async(pdfId: string) => {
    try {
        const [pdf] = await db.select().from(pdfs).where(eq(pdfs.id, pdfId))
        return pdf
    } catch (err) {
        throw new Error(`Failed to get pdf : ${err}`)
    }
}