import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/identity";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createToken, setSessionCookie, getSession, clearSession } from "@/lib/auth/session";

const registerSchema = z.object({
  action: z.literal("register"),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  action: z.literal("login"),
  email: z.string().email(),
  password: z.string().min(1),
});

const logoutSchema = z.object({ action: z.literal("logout") });
const profileSchema = z.object({ action: z.literal("profile") });

const authSchema = z.discriminatedUnion("action", [
  registerSchema,
  loginSchema,
  logoutSchema,
  profileSchema,
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = authSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  try {
    if (data.action === "register") {
      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, data.email));
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const [user] = await db.insert(users).values({
        name: data.name,
        email: data.email,
        passwordHash,
        role: "customer",
      }).returning({ id: users.id, name: users.name, email: users.email, role: users.role });

      const token = await createToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
      await setSessionCookie(token);

      return NextResponse.json({ user }, { status: 201 });
    }

    if (data.action === "login") {
      const [user] = await db.select().from(users).where(eq(users.email, data.email));
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const valid = await bcrypt.compare(data.password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = await createToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
      await setSessionCookie(token);

      return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    if (data.action === "logout") {
      await clearSession();
      return NextResponse.json({ success: true });
    }

    if (data.action === "profile") {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(session);
    }
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
