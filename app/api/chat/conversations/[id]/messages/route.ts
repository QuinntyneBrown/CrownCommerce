import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { messages, conversations } from "@/lib/db/schema/chat";
import { eq, asc } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const allMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));
    return NextResponse.json(allMessages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await request.json();
    const input = sendMessageSchema.parse(json);

    const [convo] = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.id, id));
    if (!convo) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const [msg] = await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: input.content,
    }).returning();

    return NextResponse.json(msg, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
