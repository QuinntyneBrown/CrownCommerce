import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/identity";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const [user] = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).where(eq(users.id, id));
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  });
}

const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum(["customer", "admin", "team"]).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateUserSchema.parse(json);
    const [user] = await db.update(users).set(input).where(eq(users.id, id)).returning({ id: users.id, name: users.name, email: users.email, role: users.role });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true });
  });
}
