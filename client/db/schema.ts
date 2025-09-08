import { pgTable, pgEnum, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "premium"]);
export const statusEnum = pgEnum("status", ["pending", "completed", "failed"]);

// USERS TABLE 
export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),        // Unique user ID
  fullName: text("full_name").notNull(),        // User's full name
  email: text("email").notNull().unique(),
  plan: planEnum("plan").default("free").notNull(),      
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// PDFS TABLE
export const pdfs = pgTable("pdfs", {
  id: uuid("id").primaryKey().notNull(),        // Unique PDF ID
  userId: uuid("user_id").notNull()
    .references(() => users.id),               // FK to users
  fileName: text("file_name").notNull(),       // Name of the PDF file
  htmlContent: text("html_content").notNull(), // HTML content string
  pdfUrl: text("pdf_url").default(""),                     // link to stored PDF
  status: statusEnum("status").default("pending").notNull(), // status of PDF generation
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});