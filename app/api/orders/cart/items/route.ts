import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema/orders";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

const addItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (session) => {
    const json = await request.json();
    const input = addItemSchema.parse(json);

    const [cart] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, session.sub));
    if (!cart) {
      return NextResponse.json({ error: "Cart not found. Create a cart first." }, { status: 404 });
    }

    const [item] = await db.insert(cartItems).values({
      cartId: cart.id,
      productId: input.productId,
      quantity: input.quantity,
    }).returning();
    return NextResponse.json(item, { status: 201 });
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (session) => {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");
    if (!itemId) return NextResponse.json({ error: "id required" }, { status: 400 });

    const [cart] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, session.sub));
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)));
    return NextResponse.json({ success: true });
  });
}
