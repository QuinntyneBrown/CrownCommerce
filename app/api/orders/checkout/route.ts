import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { carts, cartItems, orders, orderItems, payments } from "@/lib/db/schema/orders";
import { products } from "@/lib/db/schema/catalog";
import { eq, inArray } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(1),
  idempotencyKey: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (session) => {
    const json = await request.json();
    const input = checkoutSchema.parse(json);

    // Check idempotency — if an order with this key exists, return it
    const [existingOrder] = await db
      .select({ id: orders.id, status: orders.status, total: orders.total })
      .from(orders)
      .where(eq(orders.idempotencyKey, input.idempotencyKey));
    if (existingOrder) {
      return NextResponse.json(existingOrder, { status: 200 });
    }

    // Load cart
    const [cart] = await db.select().from(carts).where(eq(carts.userId, session.sub));
    if (!cart) {
      return NextResponse.json({ error: "No cart found" }, { status: 400 });
    }

    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate products and get current prices
    const productIds = items.map((i) => i.productId);
    const productRows = await db
      .select({ id: products.id, price: products.price, name: products.name })
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(productRows.map((p) => [p.id, p]));
    for (const item of items) {
      if (!productMap.has(item.productId)) {
        return NextResponse.json(
          { error: `Product ${item.productId} is no longer available` },
          { status: 400 }
        );
      }
    }

    // Server-computed total from current prices
    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + parseFloat(product.price) * item.quantity;
    }, 0);

    // Create order, items, and payment in a transaction
    const result = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          userId: session.sub,
          status: "pending",
          total: total.toFixed(2),
          shippingAddress: input.shippingAddress,
          idempotencyKey: input.idempotencyKey,
        })
        .returning();

      await tx.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: productMap.get(item.productId)!.price,
        }))
      );

      await tx.insert(payments).values({
        orderId: order.id,
        amount: total.toFixed(2),
        status: "pending",
      });

      // Clear cart
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      return order;
    });

    return NextResponse.json(result, { status: 201 });
  });
}
