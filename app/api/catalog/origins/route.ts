import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { origins } from "@/lib/db/schema/catalog";
import { withAdmin } from "@/lib/auth/middleware";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allOrigins = await db.select().from(origins).orderBy(asc(origins.name));
    return NextResponse.json(allOrigins);
  } catch {
    return NextResponse.json({ error: "Failed to fetch origins" }, { status: 500 });
  }
}

const createOriginSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createOriginSchema.parse(json);
    const [origin] = await db.insert(origins).values(input).returning();
    return NextResponse.json(origin, { status: 201 });
  });
}
