import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that should redirect to /my-trips when logged in
const PUBLIC_PATHS = ["/"];

// Define paths that require authentication
const PROTECTED_PATHS = ["/my-trips", "/pricing"];

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");
  const isLoggedIn = !!userCookie;
  const pathname = request.nextUrl.pathname;

  // If user is logged in and tries to access public paths like home page
  if (isLoggedIn && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/my-trips", request.url));
  }

  // If user is not logged in and tries to access protected paths
  if (
    !isLoggedIn &&
    PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (inside /public)
     * 4. all files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|static|[\\w-]+\\.\\w+).*)",
  ],
};
