import { NextResponse, type NextRequest } from "next/server";

export type Brand = "origin" | "mane-haus";

const BRAND_HOSTNAMES: Record<string, Brand> = {
  "originhair.com": "origin",
  "www.originhair.com": "origin",
  "manehaus.com": "mane-haus",
  "www.manehaus.com": "mane-haus",
};

function getBrandFromHostname(hostname: string): Brand {
  const host = hostname.split(":")[0];
  return BRAND_HOSTNAMES[host] ?? "origin";
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-brand",
    getBrandFromHostname(request.headers.get("host") ?? "localhost")
  );

  const token = request.cookies.get("auth-token")?.value;

  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/teams") && pathname !== "/teams/login" && !token) {
    return NextResponse.redirect(new URL("/teams/login", request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|api).*)"],
};
