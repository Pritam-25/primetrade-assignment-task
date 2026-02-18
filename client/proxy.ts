// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Pages that should only be accessible when NOT authenticated
  const authPages = ["/login", "/signup"];

  // Protected pages that require authentication
  const protectedRoutes = ["/tasks"];

  const jwt = request.cookies.get("jwt")?.value;

  // Redirect logged-in users away from auth pages
  if (authPages.includes(pathname) && jwt) {
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Protect /tasks page
  if (protectedRoutes.includes(pathname) && !jwt) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users from landing page
  if (pathname === "/" && jwt) {
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Otherwise, allow access
  return NextResponse.next();
}

// Apply proxy to these routes
export const config = {
  matcher: ["/", "/login", "/signup", "/tasks"],
};
