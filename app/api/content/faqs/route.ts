import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema/content";
import { withAdmin } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.category));
    return NextResponse.json(allFaqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

const createFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createFaqSchema.parse(json);
    const [faq] = await db.insert(faqs).values(input).returning();
    return NextResponse.json(faq, { status: 201 });
  });
}
