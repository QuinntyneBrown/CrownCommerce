import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
    if (!cart) return NextResponse.json({ items: [] });
    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));
    return NextResponse.json({ ...cart, items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [cart] = await db.insert(carts).values(body).returning();
    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
  }
}
