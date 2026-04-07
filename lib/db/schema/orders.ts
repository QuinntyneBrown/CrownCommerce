import { pgSchema, uuid, varchar, decimal, integer, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const ordersSchema = pgSchema("orders");

export const carts = ordersSchema.table("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = ordersSchema.table("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").references(() => carts.id).notNull(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const orders = ordersSchema.table("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = ordersSchema.table("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const payments = ordersSchema.table("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  confirmedAt: timestamp("confirmed_at"),
  refundedAt: timestamp("refunded_at"),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
}));
