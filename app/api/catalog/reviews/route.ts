import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema/catalog";
import { eq, desc } from "drizzle-orm";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
    return NextResponse.json(productReviews);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

const createReviewSchema = z.object({
  productId: z.string().uuid(),
  author: z.string().min(1).max(255),
  rating: z.number().int().min(1).max(5),
  content: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`${ip}:review`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many review submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  try {
    const json = await request.json();
    const input = createReviewSchema.parse(json);
    const [review] = await db.insert(reviews).values(input).returning();
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid review data", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
