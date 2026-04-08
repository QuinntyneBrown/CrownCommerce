import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { messages, conversations } from "@/lib/db/schema/chat";
import { eq, asc } from "drizzle-orm";
import { checkRateLimit } from "@/lib/auth/rate-limit";

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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`${ip}:chat`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait before sending more." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  try {
    const { id } = await params;
    const json = await request.json();
    const input = sendMessageSchema.parse(json);

    const [convo] = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.id, id));
    if (!convo) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Persist user message
    const [userMsg] = await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: input.content,
    }).returning();

    // Generate and persist assistant response
    // TODO: Replace with actual AI streaming (OpenAI/Vercel AI SDK) when ready
    const assistantContent = "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to browse our FAQ page for quick answers.";

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: assistantContent,
    });

    return NextResponse.json({ message: userMsg, assistantMessage: assistantContent }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
