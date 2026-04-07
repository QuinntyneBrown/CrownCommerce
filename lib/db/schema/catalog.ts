import { pgSchema, uuid, varchar, text, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const catalogSchema = pgSchema("catalog");

export const products = catalogSchema.table("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  texture: varchar("texture", { length: 100 }),
  type: varchar("type", { length: 100 }),
  length: varchar("length", { length: 50 }),
  originId: uuid("origin_id").references(() => origins.id),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const origins = catalogSchema.table("origins", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
});

export const reviews = catalogSchema.table("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bundleDeals = catalogSchema.table("bundle_deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  items: text("items").notNull(), // JSON array of product IDs
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  dealPrice: decimal("deal_price", { precision: 10, scale: 2 }).notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  origin: one(origins, { fields: [products.originId], references: [origins.id] }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));
