import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { trustBarItems } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [item] = await db.select().from(trustBarItems).where(eq(trustBarItems.id, id));
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to fetch trust bar item" }, { status: 500 });
  }
}

const updateTrustBarSchema = z.object({
  icon: z.string().min(1).max(100).optional(),
  text: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateTrustBarSchema.parse(json);
    const [item] = await db.update(trustBarItems).set(input).where(eq(trustBarItems.id, id)).returning();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(trustBarItems).where(eq(trustBarItems.id, id));
    return NextResponse.json({ success: true });
  });
}
