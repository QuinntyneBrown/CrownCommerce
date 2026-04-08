import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

const updateFaqSchema = z.object({
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  category: z.string().max(100).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateFaqSchema.parse(json);
    const [faq] = await db.update(faqs).set(input).where(eq(faqs.id, id)).returning();
    if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(faq);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ success: true });
  });
}
