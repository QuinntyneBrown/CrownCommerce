import { pgSchema, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const chatSchema = pgSchema("chat");

export const conversations = chatSchema.table("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = chatSchema.table("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));
