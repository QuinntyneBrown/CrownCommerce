import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

const updateTestimonialSchema = z.object({
  quote: z.string().min(1).optional(),
  author: z.string().min(1).max(255).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  location: z.string().max(255).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateTestimonialSchema.parse(json);
    const [item] = await db.update(testimonials).set(input).where(eq(testimonials.id, id)).returning();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ success: true });
  });
}
