import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema/orders";

export async function GET() {
  try {
    const allPayments = await db.select().from(payments);
    return NextResponse.json(allPayments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [payment] = await db.insert(payments).values(body).returning();
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
