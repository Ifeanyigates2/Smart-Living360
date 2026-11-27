import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/session";

// Staff pages and staff API routes need a valid session. The login page is open.
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path === "/ops/login") return NextResponse.next();

  const session = await verifySessionToken(req.cookies.get(COOKIE_NAME)?.value);
  if (session) return NextResponse.next();

  if (path.startsWith("/api/ops")) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/ops/login", req.url));
}

export const config = {
  matcher: ["/ops/:path*", "/api/ops/:path*"],
};
