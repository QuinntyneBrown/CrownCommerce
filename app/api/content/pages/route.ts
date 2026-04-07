import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/content";

export async function GET() {
  try {
    const allPages = await db.select().from(pages);
    return NextResponse.json(allPages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [page] = await db.insert(pages).values(body).returning();
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
