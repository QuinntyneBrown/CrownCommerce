import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { channels } from "@/lib/db/schema/scheduling";
import { withAuth } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const all = await db.select().from(channels).orderBy(asc(channels.name));
    return NextResponse.json(all);
  });
}

const createChannelSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(["public", "private"]).optional(),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (session) => {
    const json = await request.json();
    const input = createChannelSchema.parse(json);
    const [channel] = await db.insert(channels).values({
      ...input,
      createdBy: session.sub,
    }).returning();
    return NextResponse.json(channel, { status: 201 });
  });
}
