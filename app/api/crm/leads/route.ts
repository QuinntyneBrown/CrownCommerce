import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/crm";
import { withAdmin } from "@/lib/auth/middleware";
import { desc, eq, ilike, and, type SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const params = request.nextUrl.searchParams;
    const q = params.get("q");
    const status = params.get("status");
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "25", 10) || 25));
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];
    if (q) conditions.push(ilike(leads.name, `%${q}%`));
    if (status) conditions.push(eq(leads.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const all = await db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(pageSize).offset(offset);
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
