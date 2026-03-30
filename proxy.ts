import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/src/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/setup: the server component handles the credential-exists check
  // and redirects to /admin/login if already configured. Pass through here.
  if (pathname === "/admin/setup") {
    return NextResponse.next();
  }

  // /admin/login: if already logged in, send to dashboard
  if (pathname === "/admin/login") {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    if (session.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  // All other /admin/* routes: require active session
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
