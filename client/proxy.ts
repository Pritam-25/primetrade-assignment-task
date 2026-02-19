// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/utils/env";
import { API } from "./lib/api";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Pages only for guests (not logged in)
  const authPages = ["/login", "/signup"];

  // Protected pages that require login
  const protectedRoutes = ["/tasks", "/profile"];

  // Forward cookies to backend profile endpoint because middleware cannot
  // read httpOnly cookies set on a different domain in production.
  const cookieHeader = request.headers.get("cookie") || "";

  let isLoggedIn = false;
  try {
    const profileEndpoint = `${env.NEXT_PUBLIC_API_URL}${API.user}`;

    const profileRes = await fetch(profileEndpoint, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    isLoggedIn = profileRes.ok;
  } catch (err) {
    isLoggedIn = false;
  }

  // Redirect logged-in users away from login/signup pages
  if (authPages.includes(pathname) && isLoggedIn) {
    console.log("User is authenticated, redirecting to tasks from proxy");
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users from protected pages
  if (protectedRoutes.includes(pathname) && !isLoggedIn) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users from landing page to tasks
  if (pathname === "/" && isLoggedIn) {
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
