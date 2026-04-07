import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { origins } from "@/lib/db/schema/catalog";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [origin] = await db.select().from(origins).where(eq(origins.id, id));
    if (!origin) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(origin);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch origin" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [origin] = await db.update(origins).set(body).where(eq(origins.id, id)).returning();
    if (!origin) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(origin);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update origin" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(origins).where(eq(origins.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete origin" }, { status: 500 });
  }
}
