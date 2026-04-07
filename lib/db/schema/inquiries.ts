import { pgSchema, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const inquiriesSchema = pgSchema("inquiries");

export const inquiries = inquiriesSchema.table("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
