export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC = ["/signin", "/api/auth", "/mockup.html", "/favicon.ico", "/_next", "/static"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (isPublic) return NextResponse.next();
  if (!req.auth) {
    const url = new URL("/signin", req.url);
    if (pathname !== "/") url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|mockup.html).*)"],
};
