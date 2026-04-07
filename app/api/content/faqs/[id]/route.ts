import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [faq] = await db.update(faqs).set(body).where(eq(faqs.id, id)).returning();
    if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
