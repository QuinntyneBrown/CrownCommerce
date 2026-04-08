import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";
import { withAuth } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const all = await db.select().from(meetings).orderBy(asc(meetings.date), asc(meetings.startTime));
    return NextResponse.json(all);
  });
}

const createMeetingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  location: z.string().max(255).optional(),
  organizerId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    const json = await request.json();
    const input = createMeetingSchema.parse(json);
    const [meeting] = await db.insert(meetings).values(input).returning();
    return NextResponse.json(meeting, { status: 201 });
  });
}
