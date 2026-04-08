import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { trustBarItems } from "@/lib/db/schema/content";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET() {
  try {
    const all = await db.select().from(trustBarItems);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Failed to fetch trust bar" }, { status: 500 });
  }
}

const createTrustBarSchema = z.object({
  icon: z.string().min(1).max(100),
  text: z.string().min(1).max(255),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createTrustBarSchema.parse(json);
    const [item] = await db.insert(trustBarItems).values(input).returning();
    return NextResponse.json(item, { status: 201 });
  });
}
