import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema/crm";
import { withAdmin } from "@/lib/auth/middleware";
import { asc, ilike, eq, and, type SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const params = request.nextUrl.searchParams;
    const q = params.get("q");
    const status = params.get("status");
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "25", 10) || 25));
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];
    if (q) conditions.push(ilike(customers.name, `%${q}%`));
    if (status) conditions.push(eq(customers.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const all = await db.select().from(customers).where(where).orderBy(asc(customers.name)).limit(pageSize).offset(offset);
    return NextResponse.json(all);
  });
}

const createCustomerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  status: z.enum(["active", "inactive"]).optional(),
  tier: z.enum(["standard", "premium", "vip"]).optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createCustomerSchema.parse(json);
    const [customer] = await db.insert(customers).values(input).returning();
    return NextResponse.json(customer, { status: 201 });
  });
}
