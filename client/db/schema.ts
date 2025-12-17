import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "creator"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  plan: planEnum("plan").default("free").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  creditsLeft: integer("credits_left").default(20).notNull(),
  creditsResetAt: date("credits_reset_at")
    .notNull()
    .default(sql`(now() at time zone 'utc')::date`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const pdf = pgTable("pdf", {
  id: text("id").primaryKey().notNull(), // Unique PDF ID
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), // FK to user
  fileName: text("file_name").notNull().default("Untitled"), // Name of the PDF file
  htmlContent: text("html_content").notNull(), // HTML content string
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const context = pgTable("context", {
  id: text("id").primaryKey().notNull(),
  pdfId: text("pdf_id")
    .notNull()
    .references(() => pdf.id, { onDelete: "cascade" }),
  files: text("files").array(),
});

export const credit_history = pgTable("credit_history", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull().default("Unknown"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const schema = {
  user,
  pdf,
  verification,
  account,
  session,
  context,
  credit_history,
};

