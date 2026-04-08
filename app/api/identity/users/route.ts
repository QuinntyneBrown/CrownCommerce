import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/identity";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const allUsers = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
      .from(users)
      .orderBy(desc(users.createdAt));
    return NextResponse.json(allUsers);
  });
}
