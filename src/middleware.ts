import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for session cookie (optimistic check)
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // Redirect to sign-in if no session cookie
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
