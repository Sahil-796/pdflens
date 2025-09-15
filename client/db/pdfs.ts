import { db } from "./client"
import { user, pdf } from "./schema"
import { eq, lt, gte, ne, sql } from 'drizzle-orm';


export const createPdfPending = async (
  id: string,
  userId: string,
  fileName: string,
) => {
  try {
    const [newPdf] = await db
      .insert(pdf)
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

export const updatepdftatus = async (
  id: string,
  status: "completed" | "failed",
  htmlContent?: string,
  pdfUrl?: string
) => {
  try {
    const [updatedPdf] = await db
      .update(pdf)
      .set({
        status,
        htmlContent: htmlContent ?? "",
        pdfUrl: pdfUrl ?? null
      })
      .where(eq(pdf.id, id))
      .returning();

    return updatedPdf;
  } catch (err) {
    throw new Error(`Failed to update PDF: ${(err as Error).message}`);
  }
};


export const getAllpdf = async(userId: string) => {
    try {
        const [allpdf] = await db.select().from(pdf).where(eq(pdf.userId, userId))
        return [allpdf]
    } catch (err) {
        throw new Error(`Failed to get pdf: ${err}`)
    }
}

export const getPdf = async(pdfId: string) => {
    try {
        const [currPdf] = await db.select().from(pdf).where(eq(pdf.id, pdfId))
        return currPdf
    } catch (err) {
        throw new Error(`Failed to get pdf : ${err}`)
    }
}