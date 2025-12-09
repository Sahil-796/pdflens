import { db } from "./client";
import { pdf, context } from "./schema";
import { eq, and, desc } from "drizzle-orm";

export const createPdf = async (
  id: string,
  userId: string,
  fileName: string,
  html_content: string,
) => {
  try {
    const [newPdf] = await db
      .insert(pdf)
      .values({
        id,
        userId,
        fileName,
        htmlContent: html_content,
      })
      .returning();
    return newPdf;
  } catch (err) {
    throw new Error(`Failed to create pdf : ${err}`);
  }
};

export const updatePdf = async (
  id: string,
  userId: string,
  filename: string,
  htmlContent?: string,
) => {
  try {
    const [updatedPdf] = await db
      .update(pdf)
      .set({
        fileName: filename,
        htmlContent: htmlContent ?? "",
      })
      .where(and(eq(pdf.id, id), eq(pdf.userId, userId)))
      .returning({
        id: pdf.id,
        fileName: pdf.fileName,
        createdAt: pdf.createdAt,
        htmlContent: pdf.htmlContent,
      });

    return updatedPdf;
  } catch (err) {
    throw new Error(`Failed to update PDF: ${(err as Error).message}`);
  }
};

export const getAllPdfs = async (userId: string) => {
  try {
    return await db
      .select({
        id: pdf.id,
        fileName: pdf.fileName,
        createdAt: pdf.createdAt,
      })
      .from(pdf)
      .where(eq(pdf.userId, userId))
      .orderBy(desc(pdf.createdAt));
  } catch (err) {
    throw new Error(`Failed to get pdfs: ${err}`);
  }
};

export const getPdf = async (pdfId: string, userId: string) => {
  try {
    const [currPdf] = await db
      .select()
      .from(pdf)
      .where(and(eq(pdf.id, pdfId), eq(pdf.userId, userId)));
    return currPdf;
  } catch (err) {
    throw new Error(`Failed to get pdf: ${err}`);
  }
};

export const deletePdf = async (pdfId: string, userId: string) => {
  try {
    const [deletedPdf] = await db
      .delete(pdf)
      .where(and(eq(pdf.id, pdfId), eq(pdf.userId, userId)))
      .returning({ id: pdf.id });
    return deletedPdf;
  } catch (err) {
    throw new Error(`Failed to delete pdf: ${err}`);
  }
};
