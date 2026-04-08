import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema/notifications";
import { eq, desc } from "drizzle-orm";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  return withAuth(request, async (session) => {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientId, session.sub))
      .orderBy(desc(notifications.createdAt));
    return NextResponse.json(userNotifications);
  });
}

const createNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  type: z.string().min(1).max(100),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    const json = await request.json();
    const input = createNotificationSchema.parse(json);
    const [notif] = await db.insert(notifications).values(input).returning();
    return NextResponse.json(notif, { status: 201 });
  });
}
