import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema/newsletter";
import { withAdmin } from "@/lib/auth/middleware";
import { eq, and, desc } from "drizzle-orm";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const all = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
    return NextResponse.json(all);
  });
}

const subscribeSchema = z.object({
  email: z.string().email().max(255),
  brandTag: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`${ip}:newsletter`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  try {
    const json = await request.json();
    const input = subscribeSchema.parse(json);

    const [existing] = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(
        input.brandTag
          ? and(eq(subscribers.email, input.email), eq(subscribers.brandTag, input.brandTag))
          : eq(subscribers.email, input.email)
      );

    if (existing) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await db.insert(subscribers).values({
      email: input.email,
      brandTag: input.brandTag,
      status: "pending",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
