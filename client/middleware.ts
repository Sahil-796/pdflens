import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // server-side BetterAuth

export async function middleware(req: NextRequest) {
  // Validate session using BetterAuth
  const session = await auth.api.getSession({ headers: req.headers });

  // If no valid session
  if (!session) {
    // API route → return 401
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Page route → redirect to login/home
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Inject userId into headers so API routes can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", session.user.id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply middleware to both pages and API routes
export const config = {
  matcher: [
    "/dashboard",
    "/generate",
    "/tools",
    "/edit",
    "/api/:path*", // 👈 protect all API routes too
  ],
};
