import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema/chat";

export async function GET() {
  try {
    const all = await db.select().from(conversations);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [convo] = await db.insert(conversations).values(body).returning();
    return NextResponse.json(convo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
