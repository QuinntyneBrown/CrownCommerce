import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { bundleDeals } from "@/lib/db/schema/catalog";
import { withAdmin } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const deals = await db.select().from(bundleDeals).orderBy(asc(bundleDeals.name));
    return NextResponse.json(deals);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bundle deals" }, { status: 500 });
  }
}

const createBundleDealSchema = z.object({
  name: z.string().min(1),
  items: z.string().min(1),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  dealPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createBundleDealSchema.parse(json);
    const [deal] = await db.insert(bundleDeals).values(input).returning();
    return NextResponse.json(deal, { status: 201 });
  });
}
