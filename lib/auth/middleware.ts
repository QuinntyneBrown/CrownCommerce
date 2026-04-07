import { verifyToken } from "./session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function withAuth(
  request: NextRequest,
  handler: (session: { sub: string; email: string; name: string; role: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("auth-token")?.value;
  const token = authHeader?.replace("Bearer ", "") || cookieToken;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  return handler(session);
}

export async function withAdmin(
  request: NextRequest,
  handler: (session: { sub: string; email: string; name: string; role: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (session) => {
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(session);
  });
}
