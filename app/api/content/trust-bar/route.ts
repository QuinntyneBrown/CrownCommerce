import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trustBarItems } from "@/lib/db/schema/content";

export async function GET() {
  try {
    const all = await db.select().from(trustBarItems);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trust bar" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [item] = await db.insert(trustBarItems).values(body).returning();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trust bar item" }, { status: 500 });
  }
}
