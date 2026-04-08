import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery image" }, { status: 500 });
  }
}

const updateGalleryImageSchema = z.object({
  url: z.string().url().max(500).optional(),
  altText: z.string().max(255).optional(),
  category: z.string().max(100).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateGalleryImageSchema.parse(json);
    const [image] = await db.update(galleryImages).set(input).where(eq(galleryImages.id, id)).returning();
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(image);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return NextResponse.json({ success: true });
  });
}
