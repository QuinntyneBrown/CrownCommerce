import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema/notifications";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

const markReadSchema = z.object({
  read: z.boolean(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async (session) => {
    const { id } = await params;
    const json = await request.json();
    const input = markReadSchema.parse(json);
    const [notif] = await db
      .update(notifications)
      .set(input)
      .where(and(eq(notifications.id, id), eq(notifications.recipientId, session.sub)))
      .returning();
    if (!notif) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(notif);
  });
}
