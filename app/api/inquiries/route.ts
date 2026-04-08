import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema/inquiries";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const all = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
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
});

const inquirySchema = z.discriminatedUnion("category", [
  contactSchema,
  wholesaleSchema,
  ambassadorSchema,
]);

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = inquirySchema.parse(json);
    const [inquiry] = await db.insert(inquiries).values({
      ...input,
      status: "new",
    }).returning();
    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid inquiry data", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
