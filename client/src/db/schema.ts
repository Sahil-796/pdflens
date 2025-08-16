
import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name'),
  email: text('email')
});

export const pdfs = pgTable("pdfs", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").references(()=> users.id).notNull(),
    fileName: text("file_name").notNull(),
    htmlContent: text("html_content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true}).defaultNow(),
})