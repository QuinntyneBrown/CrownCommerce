import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema/scheduling";

export async function GET() {
  try {
    const all = await db.select().from(employees);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [emp] = await db.insert(employees).values(body).returning();
    return NextResponse.json(emp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
