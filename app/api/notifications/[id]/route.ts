import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema/notifications";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [notif] = await db.update(notifications).set(body).where(eq(notifications.id, id)).returning();
    if (!notif) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(notif);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
