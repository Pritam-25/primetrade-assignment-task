// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/utils/env";
import { API } from "./lib/api";
import { ur } from "zod/locales";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const token = request.cookies.get("jwt")?.value;
  const isLoggedIn = !!token;

  // Pages only for guests (not logged in)
  const authPages = ["/login", "/signup"];

  // Protected pages that require login
  const protectedRoutes = ["/tasks", "/profile"];

  // Redirect logged in users away from auth pages
  if (authPages.includes(pathname) && isLoggedIn) {
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Redirect logged out users to login page for protected routes
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // redirect logged in user form landing page to tasks page
  if (pathname === "/" && isLoggedIn) {
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*", "/profile/:path*", "/login", "/signup", "/"],
};
