import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { channelMessages } from "@/lib/db/schema/scheduling";
import { eq, asc } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get("pageSize") || "50", 10) || 50));
    const offset = (page - 1) * pageSize;

    const msgs = await db
      .select()
      .from(channelMessages)
      .where(eq(channelMessages.channelId, id))
      .orderBy(asc(channelMessages.createdAt))
      .limit(pageSize)
      .offset(offset);
    return NextResponse.json(msgs);
  });
}

const sendMessageSchema = z.object({
  senderId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = sendMessageSchema.parse(json);
    const [msg] = await db.insert(channelMessages).values({
      channelId: id,
      senderId: input.senderId,
      content: input.content,
    }).returning();
    return NextResponse.json(msg, { status: 201 });
  });
}
