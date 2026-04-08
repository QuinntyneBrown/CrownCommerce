import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "25", 10) || 25));
    const offset = (page - 1) * pageSize;

    const allOrders = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(pageSize)
      .offset(offset);
    return NextResponse.json(allOrders);
  });
}

const createOrderSchema = z.object({
  userId: z.string().uuid().optional(),
  shippingAddress: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createOrderSchema.parse(json);
    const [order] = await db.insert(orders).values({
      ...input,
      total: "0.00",
    }).returning();
    return NextResponse.json(order, { status: 201 });
  });
}
