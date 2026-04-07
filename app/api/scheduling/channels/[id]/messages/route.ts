import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { channelMessages } from "@/lib/db/schema/scheduling";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const msgs = await db.select().from(channelMessages).where(eq(channelMessages.channelId, id));
    return NextResponse.json(msgs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [msg] = await db.insert(channelMessages).values({ ...body, channelId: id }).returning();
    return NextResponse.json(msg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
