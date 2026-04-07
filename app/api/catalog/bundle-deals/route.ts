import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bundleDeals } from "@/lib/db/schema/catalog";

export async function GET() {
  try {
    const deals = await db.select().from(bundleDeals);
    return NextResponse.json(deals);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bundle deals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [deal] = await db.insert(bundleDeals).values(body).returning();
    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create bundle deal" }, { status: 500 });
  }
}
