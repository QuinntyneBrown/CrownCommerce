import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema/content";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(testimonials).orderBy(desc(testimonials.author));
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

const createTestimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1).max(255),
  rating: z.number().int().min(1).max(5),
  location: z.string().max(255).optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createTestimonialSchema.parse(json);
    const [item] = await db.insert(testimonials).values(input).returning();
    return NextResponse.json(item, { status: 201 });
  });
}
