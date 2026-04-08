import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema/scheduling";
import { eq } from "drizzle-orm";
import { withAuth, withAdmin } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    const [emp] = await db.select().from(employees).where(eq(employees.id, id));
    if (!emp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(emp);
  });
}

const updateEmployeeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  timezone: z.string().max(100).optional(),
  presence: z.enum(["online", "away", "busy", "offline"]).optional(),
  avatarUrl: z.string().url().max(500).nullable().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateEmployeeSchema.parse(json);
    const [emp] = await db.update(employees).set(input).where(eq(employees.id, id)).returning();
    if (!emp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(emp);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(employees).where(eq(employees.id, id));
    return NextResponse.json({ success: true });
  });
}
