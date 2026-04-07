import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [payment] = await db.update(payments).set(body).where(eq(payments.id, id)).returning();
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
