// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/utils/env";
import { API } from "./lib/api";

export async function proxy(request: NextRequest) {
  // Get all cookies from the incoming request
  const cookieHeader = request.headers.get("cookie") || "";

  // Forward the cookies to the backend's profile/auth endpoint
  try {
    const profileEndpoint = `${env.NEXT_PUBLIC_API_URL}${API.user}`;

    const profileRes = await fetch(profileEndpoint, {
      method: "GET",
      headers: {
        cookie: cookieHeader, // <-- forward cookies here
      },
      credentials: "include", // include cookies for cross-origin
    });

    // Optional: set a header so frontend can debug if user is logged in
    const response = NextResponse.next();
    response.headers.set("x-is-logged-in", profileRes.ok ? "true" : "false");
    return response;
  } catch (err) {
    // On error, continue the request without blocking
    return NextResponse.next();
  }
}

// Apply middleware only to routes you want to forward cookies on
export const config = {
  matcher: ["/tasks", "/profile", "/login", "/signup", "/"],
};
