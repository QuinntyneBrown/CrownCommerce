import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema/scheduling";
import { withAuth } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const all = await db.select().from(files).orderBy(desc(files.createdAt));
    return NextResponse.json(all);
  });
}

const uploadFileSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().url().max(500),
  contentType: z.string().max(100).optional(),
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
