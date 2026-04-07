import { pgSchema, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const crmSchema = pgSchema("crm");

export const customers = crmSchema.table("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("active"),
  tier: varchar("tier", { length: 50 }).default("standard"),
  orderCount: integer("order_count").default(0),
});

export const leads = crmSchema.table("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  source: varchar("source", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
