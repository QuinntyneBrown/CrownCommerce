import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { heroContent } from "@/lib/db/schema/content";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET() {
  try {
    const all = await db.select().from(heroContent);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
  }
}

const heroSchema = z.object({
  title: z.string().min(1).max(255),
  subtitle: z.string().optional(),
  ctaText: z.string().max(100).optional(),
  ctaLink: z.string().max(255).optional(),
  imageUrl: z.string().url().max(500).optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = heroSchema.parse(json);
    const [item] = await db.insert(heroContent).values(input).returning();
    return NextResponse.json(item, { status: 201 });
  });
}
