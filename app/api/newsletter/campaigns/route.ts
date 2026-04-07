import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/newsletter";

export async function GET() {
  try {
    const all = await db.select().from(campaigns);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [campaign] = await db.insert(campaigns).values(body).returning();
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
