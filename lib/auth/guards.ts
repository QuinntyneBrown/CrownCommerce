import { getSession, type SessionPayload } from "./session";
import { redirect } from "next/navigation";

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    redirect("/");
  }
  return session;
}

export async function requireTeamMember(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "admin" && session.role !== "team") {
    redirect("/");
  }
  return session;
}
