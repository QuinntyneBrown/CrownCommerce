import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema/orders";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const allPayments = await db.select().from(payments).orderBy(desc(payments.orderId));
    return NextResponse.json(allPayments);
  });
}

const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createPaymentSchema.parse(json);
    const [payment] = await db.insert(payments).values({
      ...input,
      status: "pending",
    }).returning();
    return NextResponse.json(payment, { status: 201 });
  });
}
