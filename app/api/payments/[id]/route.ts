import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(payment);
  });
}

const updatePaymentSchema = z.object({
  status: z.enum(["pending", "confirmed", "refunded"]),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updatePaymentSchema.parse(json);

    const timestamps: Record<string, Date> = {};
    if (input.status === "confirmed") timestamps.confirmedAt = new Date();
    if (input.status === "refunded") timestamps.refundedAt = new Date();

    const [payment] = await db.update(payments).set({ ...input, ...timestamps }).where(eq(payments.id, id)).returning();
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(payment);
  });
}
