import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema/newsletter";

export async function GET() {
  try {
    const all = await db.select().from(subscribers);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [sub] = await db.insert(subscribers).values(body).returning();
    return NextResponse.json(sub, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
  }
}
