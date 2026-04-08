import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { heroContent } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [hero] = await db.select().from(heroContent).where(eq(heroContent.id, id));
    if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hero);
  } catch {
    return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
  }
}

const updateHeroSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().optional(),
  ctaText: z.string().max(100).optional(),
  ctaLink: z.string().max(255).optional(),
  imageUrl: z.string().url().max(500).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateHeroSchema.parse(json);
    const [hero] = await db.update(heroContent).set(input).where(eq(heroContent.id, id)).returning();
    if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hero);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(heroContent).where(eq(heroContent.id, id));
    return NextResponse.json({ success: true });
  });
}
