import { db } from "./client"
import { user, pdf } from "./schema"
import { eq, lt, gte, ne, sql } from 'drizzle-orm';


export const createPdf = async (
  id: string,
  userId: string,
  fileName: string,
  html_content: string
) => {
  try {
    const [newPdf] = await db
      .insert(pdf)
      .values({
        id,
        userId,
        fileName,
        htmlContent: html_content   
            })
      .returning();
    return newPdf

    } catch (err) { 
        throw new Error(`Failed to create pdf : ${err}`)
    }
}

export const updatePdf = async (
  id: string,
  htmlContent?: string,
) => {
  try {
    const [updatedPdf] = await db
      .update(pdf)
      .set({
        htmlContent: htmlContent ?? "",
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
        const allpdf = await db.select().from(pdf).where(eq(pdf.userId, userId))
        return allpdf
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