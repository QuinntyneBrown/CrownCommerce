import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/content";
import { withAdmin } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(galleryImages).orderBy(asc(galleryImages.category));
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

const createGalleryImageSchema = z.object({
  url: z.string().url().max(500),
  altText: z.string().max(255).optional(),
  category: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createGalleryImageSchema.parse(json);
    const [item] = await db.insert(galleryImages).values(input).returning();
    return NextResponse.json(item, { status: 201 });
  });
}
