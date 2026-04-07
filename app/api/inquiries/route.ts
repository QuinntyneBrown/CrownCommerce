import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema/inquiries";

export async function GET() {
  try {
    const all = await db.select().from(inquiries);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [inquiry] = await db.insert(inquiries).values(body).returning();
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
