import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
});

export const pdfs = pgTable("pdfs", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(()=> users.id).notNull(),
    fileName: text("file_name").notNull(),
    htmlContent: text("html_content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true}).defaultNow(),
})