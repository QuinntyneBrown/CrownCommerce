import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema/inquiries";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inquiry);
  });
}

const updateInquirySchema = z.object({
  status: z.enum(["new", "in-progress", "resolved", "closed"]),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateInquirySchema.parse(json);
    const [inquiry] = await db.update(inquiries).set(input).where(eq(inquiries.id, id)).returning();
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inquiry);
  });
}
