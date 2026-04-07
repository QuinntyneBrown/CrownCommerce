import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";

export async function GET() {
  try {
    const all = await db.select().from(meetings);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [meeting] = await db.insert(meetings).values(body).returning();
    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}
