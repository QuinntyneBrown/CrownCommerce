import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema/scheduling";
import { withAuth } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const all = await db.select().from(employees).orderBy(asc(employees.name));
    return NextResponse.json(all);
  });
}

const createEmployeeSchema = z.object({
  name: z.string().min(1).max(255),
  userId: z.string().uuid().optional(),
  role: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  timezone: z.string().max(100).optional(),
  avatarUrl: z.string().url().max(500).optional(),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    const json = await request.json();
    const input = createEmployeeSchema.parse(json);
    const [emp] = await db.insert(employees).values(input).returning();
    return NextResponse.json(emp, { status: 201 });
  });
}
