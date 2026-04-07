import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema/scheduling";

export async function GET() {
  try {
    const all = await db.select().from(files);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [file] = await db.insert(files).values(body).returning();
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
