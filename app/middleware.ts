import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export type Brand = "origin" | "mane-haus";

const BRAND_HOSTNAMES: Record<string, Brand> = {
  "originhair.com": "origin",
  "www.originhair.com": "origin",
  "manehaus.com": "mane-haus",
  "www.manehaus.com": "mane-haus",
};

function getBrandFromHostname(hostname: string): Brand {
  // Strip port for local dev
  const host = hostname.split(":")[0];
  return BRAND_HOSTNAMES[host] || "origin";
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "localhost";
  const brand = getBrandFromHostname(hostname);
  const pathname = request.nextUrl.pathname;

  const response = NextResponse.next();

  // Set brand context header for server components
  response.headers.set("x-brand", brand);

  // Protect admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/products") || pathname.startsWith("/origins") ||
      pathname.startsWith("/customers") || pathname.startsWith("/orders") && pathname !== "/order" ||
      pathname.startsWith("/leads") || pathname.startsWith("/inquiries") || pathname.startsWith("/testimonials") ||
      pathname.startsWith("/faqs") || pathname.startsWith("/gallery") || pathname.startsWith("/content-pages") ||
      pathname.startsWith("/subscribers") || pathname.startsWith("/campaigns") || pathname.startsWith("/employees") ||
      pathname.startsWith("/users") || pathname.startsWith("/schedule") || pathname.startsWith("/meetings") && !pathname.startsWith("/meetings/") ||
      pathname.startsWith("/conversations") || pathname.startsWith("/hero-content") || pathname.startsWith("/trust-bar")) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect team routes
  if (pathname.startsWith("/home") || pathname.startsWith("/chat") || pathname.startsWith("/team")) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)",
  ],
};
