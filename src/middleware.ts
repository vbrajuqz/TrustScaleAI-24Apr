import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/signin", "/api/auth", "/mockup.html", "/favicon.ico", "/_next", "/static"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  // Edge-Runtime-safe: check session cookie directly, no Prisma needed.
  const sessionToken =
    req.cookies.get("next-auth.session-token") ??
    req.cookies.get("__Secure-next-auth.session-token");

    const url = new URL("/signin", req.url);
    if (pathname !== "/") url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
};
