// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Only apply to login/signup pages
  const authPages = ["/login", "/signup"];

  if (authPages.includes(pathname)) {
    // Check if JWT cookie exists
    const jwt = request.cookies.get("jwt")?.value;

    if (jwt) {
      // User is logged in → redirect to /tasks
      url.pathname = "/tasks";
      return NextResponse.redirect(url);
    }
  }

  // Otherwise, allow access
  return NextResponse.next();
}

// Specify which routes this proxy applies to
export const config = {
  matcher: ["/login", "/signup"],
};
