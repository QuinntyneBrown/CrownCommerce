import { pgSchema, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const contentSchema = pgSchema("content");

export const pages = contentSchema.table("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const faqs = contentSchema.table("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
});

export const testimonials = contentSchema.table("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  quote: text("quote").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  location: varchar("location", { length: 255 }),
});

export const galleryImages = contentSchema.table("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  category: varchar("category", { length: 100 }),
});

export const heroContent = contentSchema.table("hero_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  ctaText: varchar("cta_text", { length: 100 }),
  ctaLink: varchar("cta_link", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }),
});

export const trustBarItems = contentSchema.table("trust_bar_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  icon: varchar("icon", { length: 100 }).notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  description: text("description"),
});
