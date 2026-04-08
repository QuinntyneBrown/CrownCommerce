import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema/scheduling";
import { withAuth } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get("pageSize") || "25", 10) || 25));
    const offset = (page - 1) * pageSize;

    const all = await db.select().from(files).orderBy(desc(files.createdAt)).limit(pageSize).offset(offset);
    return NextResponse.json(all);
  });
}

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const uploadFileSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().url().max(500),
  contentType: z.string().max(100).refine((ct) => ALLOWED_CONTENT_TYPES.includes(ct), { message: "Unsupported file type" }),
  size: z.number().int().max(10 * 1024 * 1024).optional(), // 10MB max
  uploadedBy: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    const json = await request.json();
    const input = uploadFileSchema.parse(json);
    const [file] = await db.insert(files).values(input).returning();
    return NextResponse.json(file, { status: 201 });
  });
}
