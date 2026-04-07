import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { origins } from "@/lib/db/schema/catalog";

export async function GET() {
  try {
    const allOrigins = await db.select().from(origins);
    return NextResponse.json(allOrigins);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch origins" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [origin] = await db.insert(origins).values(body).returning();
    return NextResponse.json(origin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create origin" }, { status: 500 });
  }
}
