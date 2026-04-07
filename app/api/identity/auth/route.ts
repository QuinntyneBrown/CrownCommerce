import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/identity";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { action, ...body } = await request.json();

    if (action === "register") {
      const { name, email, password, role } = body;
      if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
      }

      const [existing] = await db.select().from(users).where(eq(users.email, email));
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [user] = await db.insert(users).values({ name, email, passwordHash, role: role || "customer" }).returning();

      const token = await createToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
      await setSessionCookie(token);

      return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }, { status: 201 });
    }

    if (action === "login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = await createToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
      await setSessionCookie(token);

      return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }

    if (action === "logout") {
      const { clearSession } = await import("@/lib/auth/session");
      await clearSession();
      return NextResponse.json({ success: true });
    }

    if (action === "profile") {
      const { getSession } = await import("@/lib/auth/session");
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(session);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
