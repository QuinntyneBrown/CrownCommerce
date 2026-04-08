import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema/inquiries";
import { withAdmin } from "@/lib/auth/middleware";
import { desc, eq, and, type SQL } from "drizzle-orm";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const params = request.nextUrl.searchParams;
    const category = params.get("category");
    const status = params.get("status");
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "25", 10) || 25));
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];
    if (category) conditions.push(eq(inquiries.category, category));
    if (status) conditions.push(eq(inquiries.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const all = await db
      .select()
      .from(inquiries)
      .where(where)
      .orderBy(desc(inquiries.createdAt))
      .limit(pageSize)
      .offset(offset);
    return NextResponse.json(all);
  });
}

const baseFields = {
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  message: z.string().min(1).max(5000),
};

const contactSchema = z.object({
  ...baseFields,
  category: z.literal("general"),
  subject: z.string().max(255).optional(),
});

const wholesaleSchema = z.object({
  ...baseFields,
  category: z.literal("wholesale"),
  subject: z.string().max(255).optional(),
});

const ambassadorSchema = z.object({
  ...baseFields,
  category: z.literal("ambassador"),
  subject: z.string().max(255).optional(),
  socialMedia: z.string().url().max(500).optional(),
  followerCount: z.string().max(50).optional(),
  platformName: z.string().max(100).optional(),
  experience: z.string().max(2000).optional(),
});

const inquirySchema = z.discriminatedUnion("category", [
  contactSchema,
  wholesaleSchema,
  ambassadorSchema,
]);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`${ip}:inquiry`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  try {
    const json = await request.json();
    const input = inquirySchema.parse(json);

    // Extract ambassador-specific fields into metadata
    const { socialMedia, followerCount, platformName, experience, ...coreFields } = input as Record<string, unknown>;
    const metadata = input.category === "ambassador"
      ? { socialMedia, followerCount, platformName, experience }
      : undefined;

    const [inquiry] = await db.insert(inquiries).values({
      name: coreFields.name as string,
      email: coreFields.email as string,
      message: coreFields.message as string,
      category: coreFields.category as string,
      subject: coreFields.subject as string | undefined,
      status: "new",
      metadata: metadata ?? null,
    }).returning();
    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid inquiry data", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
