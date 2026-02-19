// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Pages only for guests (not logged in)
  const authPages = ["/login", "/signup"];

  // Protected pages that require login
  const protectedRoutes = ["/tasks", "/profile"];

  // Check if JWT cookie exists
  const jwt = request.cookies.get("jwt")?.value;

  // Redirect logged-in users away from login/signup pages
  if (authPages.includes(pathname) && jwt) {
    console.log("User is authenticated, redirecting to tasks from proxy");
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users from protected pages
  if (protectedRoutes.includes(pathname) && !jwt) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users from landing page to tasks
  if (pathname === "/" && jwt) {
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Otherwise, allow access
  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ["/", "/login", "/signup", "/tasks", "/profile"],
};
