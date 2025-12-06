import { db } from "./client";
import { pdf, context } from "./schema";
import { eq, and, desc, lt } from "drizzle-orm";

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
      .where(eq(pdf.id, id))
      .returning();

    return updatedPdf;
  } catch (err) {
    throw new Error(`Failed to update PDF: ${(err as Error).message}`);
  }
};

export const getAllpdf = async (userId: string, limit?: number) => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    await db
      .delete(pdf)
      .where(
        and(
          eq(pdf.userId, userId),
          eq(pdf.htmlContent, ""),
          lt(pdf.createdAt, twoMinutesAgo),
        ),
      );
    return await db
      .select()
      .from(pdf)
      .where(eq(pdf.userId, userId))
      .orderBy(desc(pdf.createdAt));

    // ✅ only add limit if provided
    // if (limit) {
    //   return await query.limit(limit)
    // }
  } catch (err) {
    throw new Error(`Failed to get pdf: ${err}`);
  }
};

export const getPdf = async (pdfId: string) => {
  try {
    const [currPdf] = await db.select().from(pdf).where(eq(pdf.id, pdfId));
    return currPdf;
  } catch (err) {
    throw new Error(`Failed to get pdf : ${err}`);
  }
};

export const deletePdf = async (pdfId: string, userId: string) => {
  try {
    await db.delete(context).where(and(eq(context.pdfId, pdfId)));
    const deletedPdf = await db.delete(pdf).where(
      and(
        eq(pdf.id, pdfId),
        eq(pdf.userId, userId), // ensures the user owns the PDF
      ),
    );
    return deletedPdf;
  } catch (err) {
    throw new Error(`Failed to delete pdf: ${err}`);
  }
};

