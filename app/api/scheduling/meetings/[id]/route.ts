import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    if (!meeting) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(meeting);
  });
}

const updateMeetingSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  location: z.string().max(255).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateMeetingSchema.parse(json);
    const [meeting] = await db.update(meetings).set(input).where(eq(meetings.id, id)).returning();
    if (!meeting) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(meeting);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    await db.delete(meetings).where(eq(meetings.id, id));
    return NextResponse.json({ success: true });
  });
}
