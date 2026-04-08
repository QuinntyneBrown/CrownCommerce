import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { origins } from "@/lib/db/schema/catalog";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [origin] = await db.select().from(origins).where(eq(origins.id, id));
    if (!origin) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(origin);
  } catch {
    return NextResponse.json({ error: "Failed to fetch origin" }, { status: 500 });
  }
}

const updateOriginSchema = z.object({
  name: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateOriginSchema.parse(json);
    const [origin] = await db.update(origins).set(input).where(eq(origins.id, id)).returning();
    if (!origin) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(origin);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(origins).where(eq(origins.id, id));
    return NextResponse.json({ success: true });
  });
}
