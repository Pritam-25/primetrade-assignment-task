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
  console.log(`proxy: token present: ${token}`);
  const isLoggedIn = !!token;
  console.log(`proxy: Incoming request to ${pathname}, logged in: ${isLoggedIn}`);

  // Pages only for guests (not logged in)
  const authPages = ["/login", "/signup"];

  // Protected pages that require login
  const protectedRoutes = ["/tasks", "/profile"];

  // Redirect logged in users away from auth pages
  if (authPages.includes(pathname) && isLoggedIn) {
    console.log("proxy: Redirecting logged in user away from auth page...");
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Redirect logged out users to login page for protected routes
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    console.log("proxy: Redirecting logged out user to login page...");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // redirect logged in user form landing page to tasks page
  if (pathname === "/" && isLoggedIn) {
    console.log("proxy: Redirecting logged in user from landing page to tasks...");
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*", "/profile/:path*", "/login", "/signup", "/"],
};
