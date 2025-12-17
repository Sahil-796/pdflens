import { db } from "./client";
import { context } from "./schema";
import { v4 as uuid } from "uuid";
import { sql, eq } from "drizzle-orm";

export const createContextFile = async (pdfId: string, filename: string) => {
  try {
    const newContext = await db
      .insert(context)
      .values({
        id: uuid(),
        pdfId: pdfId,
        files: [filename],
      })
      .returning();

    return newContext;
  } catch (err) {
    console.error("Error creating context:", err);
    throw err;
  }
};

export const updateContextFile = async (pdfId: string, filename: string) => {
  try {
    const updated = await db.execute(sql`
      UPDATE context
      SET files = array_append(files, ${filename})
      WHERE pdf_id = ${pdfId}
      RETURNING *;
    `);

    return updated.length > 0;
  } catch (err) {
    console.error("Error adding context file:", err);
    throw err;
  }
};

export const removeContextFile = async (pdfId: string, filename: string) => {
  try {
    const updated = await db.execute(sql`
      UPDATE context
      SET files = array_remove(files, ${filename})
      WHERE pdf_id = ${pdfId}
      RETURNING *;
    `);

    return updated;
  } catch (err) {
    console.error("Error removing context file:", err);
    throw err;
  }
};

export const getContextFiles = async (pdfId: string) => {
  try {
    const rows = await db
      .select()
      .from(context)
      .where(eq(context.pdfId, pdfId));

    return rows[0]?.files ?? [];
  } catch (err) {
    console.error("Error fetching context files:", err);
    throw err;
  }
};
