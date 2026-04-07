import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [item] = await db.insert(cartItems).values(body).returning();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");
    if (!itemId) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}
