import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema/chat";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const all = await db.select().from(conversations).orderBy(desc(conversations.createdAt));
    return NextResponse.json(all);
  });
}

export async function POST() {
  try {
    const [convo] = await db.insert(conversations).values({}).returning();
    return NextResponse.json(convo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
