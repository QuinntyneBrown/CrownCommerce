import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/newsletter";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const all = await db.select().from(campaigns).orderBy(desc(campaigns.scheduledAt));
    return NextResponse.json(all);
  });
}

const createCampaignSchema = z.object({
  subject: z.string().min(1).max(255),
  htmlBody: z.string().optional(),
  textBody: z.string().optional(),
  tag: z.string().max(100).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createCampaignSchema.parse(json);
    const [campaign] = await db.insert(campaigns).values({
      ...input,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      status: "draft",
    }).returning();
    return NextResponse.json(campaign, { status: 201 });
  });
}
