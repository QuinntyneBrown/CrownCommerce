import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/crm";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const all = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return NextResponse.json(all);
  });
}

const createLeadSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  source: z.string().max(100).optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createLeadSchema.parse(json);
    const [lead] = await db.insert(leads).values({ ...input, status: "new" }).returning();
    return NextResponse.json(lead, { status: 201 });
  });
}
