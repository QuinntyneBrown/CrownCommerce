import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema/crm";
import { withAdmin } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const all = await db.select().from(customers).orderBy(asc(customers.name));
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
