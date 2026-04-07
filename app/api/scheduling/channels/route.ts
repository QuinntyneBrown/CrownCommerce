import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { channels } from "@/lib/db/schema/scheduling";

export async function GET() {
  try {
    const all = await db.select().from(channels);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [channel] = await db.insert(channels).values(body).returning();
    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create channel" }, { status: 500 });
  }
}
