import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  return withAuth(request, async (session) => {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, session.sub));
    if (!cart) return NextResponse.json({ items: [] });
    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));
    return NextResponse.json({ ...cart, items });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (session) => {
    const [existing] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, session.sub));
    if (existing) return NextResponse.json(existing);
    const [cart] = await db.insert(carts).values({ userId: session.sub }).returning();
    return NextResponse.json(cart, { status: 201 });
  });
}
