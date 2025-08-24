
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  fullName: text('full_name'),
  email: text('email'),
  pdfIds: text('pdf_ids').array().default([]),
  pdfNames: text('pdf_names').array().default([]),
});

export const pdfs = pgTable("pdfs", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").references(()=> users.id).notNull(),
    fileName: text("file_name").notNull(),
    htmlContent: text("html_content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true}).defaultNow(),
})