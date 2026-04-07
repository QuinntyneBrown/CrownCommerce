import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema/scheduling";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [emp] = await db.select().from(employees).where(eq(employees.id, id));
    if (!emp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(emp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [emp] = await db.update(employees).set(body).where(eq(employees.id, id)).returning();
    if (!emp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(emp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(employees).where(eq(employees.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
