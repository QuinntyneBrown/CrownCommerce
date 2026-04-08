import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";
import { withAuth, withAdmin } from "@/lib/auth/middleware";
import { asc, gte, lte, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const params = request.nextUrl.searchParams;
    const from = params.get("from");
    const to = params.get("to");
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "25", 10) || 25));
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (from) conditions.push(gte(meetings.date, from));
    if (to) conditions.push(lte(meetings.date, to));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(meetings)
      .where(where)
      .orderBy(asc(meetings.date), asc(meetings.startTime))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json(result);
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
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createMeetingSchema.parse(json);
    const [meeting] = await db.insert(meetings).values(input).returning();
    return NextResponse.json(meeting, { status: 201 });
  });
}
