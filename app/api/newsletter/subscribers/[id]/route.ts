import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema/newsletter";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, id));
    if (!subscriber) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(subscriber);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(subscribers).where(eq(subscribers.id, id));
    return NextResponse.json({ success: true });
  });
}
