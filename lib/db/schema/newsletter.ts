import { pgSchema, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const newsletterSchema = pgSchema("newsletter");

export const subscribers = newsletterSchema.table("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  brandTag: varchar("brand_tag", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaigns = newsletterSchema.table("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: varchar("subject", { length: 255 }).notNull(),
  htmlBody: text("html_body"),
  textBody: text("text_body"),
  tag: varchar("tag", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
});

export const campaignRecipients = newsletterSchema.table("campaign_recipients", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").references(() => campaigns.id).notNull(),
  subscriberId: uuid("subscriber_id").references(() => subscribers.id).notNull(),
  deliveryStatus: varchar("delivery_status", { length: 50 }).notNull().default("pending"),
});

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  recipients: many(campaignRecipients),
}));

export const campaignRecipientsRelations = relations(campaignRecipients, ({ one }) => ({
  campaign: one(campaigns, { fields: [campaignRecipients.campaignId], references: [campaigns.id] }),
  subscriber: one(subscribers, { fields: [campaignRecipients.subscriberId], references: [subscribers.id] }),
}));
