import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/newsletter";
import { eq } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(campaign);
  });
}

const updateCampaignSchema = z.object({
  subject: z.string().min(1).max(255).optional(),
  htmlBody: z.string().optional(),
  textBody: z.string().optional(),
  tag: z.string().max(100).optional(),
  status: z.enum(["draft", "scheduled", "sending", "sent", "cancelled"]).optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    const json = await request.json();
    const input = updateCampaignSchema.parse(json);

    const updateData: Record<string, unknown> = { ...input };
    if (input.scheduledAt) updateData.scheduledAt = new Date(input.scheduledAt);
    if (input.scheduledAt === null) updateData.scheduledAt = null;
    if (input.status === "sent") updateData.sentAt = new Date();

    const [campaign] = await db.update(campaigns).set(updateData).where(eq(campaigns.id, id)).returning();
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(campaign);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(request, async () => {
    const { id } = await params;
    await db.delete(campaigns).where(eq(campaigns.id, id));
    return NextResponse.json({ success: true });
  });
}
