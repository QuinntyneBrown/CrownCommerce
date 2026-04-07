import { pgSchema, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const notificationsSchema = pgSchema("notifications");

export const notifications = notificationsSchema.table("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipientId: uuid("recipient_id").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
