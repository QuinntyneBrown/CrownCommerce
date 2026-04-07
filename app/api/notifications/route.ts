import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema/notifications";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId");
    const all = recipientId
      ? await db.select().from(notifications).where(eq(notifications.recipientId, recipientId))
      : await db.select().from(notifications);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [notif] = await db.insert(notifications).values(body).returning();
    return NextResponse.json(notif, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
