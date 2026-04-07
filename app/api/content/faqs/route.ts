import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema/content";

export async function GET() {
  try {
    const allFaqs = await db.select().from(faqs);
    return NextResponse.json(allFaqs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [faq] = await db.insert(faqs).values(body).returning();
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
