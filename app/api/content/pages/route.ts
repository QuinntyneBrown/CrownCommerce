import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/content";
import { withAdmin } from "@/lib/auth/middleware";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
      if (!page) return NextResponse.json(null);
      return NextResponse.json(page);
    }
    const allPages = await db.select().from(pages).orderBy(desc(pages.createdAt));
    return NextResponse.json(allPages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

const createPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  body: z.string().min(1),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createPageSchema.parse(json);
    const [page] = await db.insert(pages).values(input).returning();
    return NextResponse.json(page, { status: 201 });
  });
}
