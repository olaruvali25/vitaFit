import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // ALWAYS skip middleware for NextAuth routes - they handle their own auth
  if (pathname.startsWith("/api/auth/")) {
    console.log(`[Middleware] Skipping auth for NextAuth route: ${pathname}`)
    return NextResponse.next()
  }
  
  // Skip middleware for other public API routes
  if (
    pathname.startsWith("/api/assessment/") ||
    pathname.startsWith("/api/plans/from-make") ||
    pathname === "/api/plans/from-make" ||
    pathname.startsWith("/api/signup") ||
    pathname === "/api/signup" ||
    pathname.startsWith("/api/test/") ||
    pathname === "/api/auth/signup" // Legacy signup route
  ) {
    console.log(`[Middleware] Skipping auth for public API route: ${pathname}`)
    return NextResponse.next()
  }
  
  // Use auth() to check session (NextAuth v5)
  const session = await auth()
  
  // For API routes, return JSON error instead of redirect
  if (pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }
  
  // For page routes, redirect to login if no session
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/account/:path*",
    "/profiles/:path*",
    "/progress/:path*",
    "/plans/:path*",
    "/api/profiles/:path*",
    "/api/plans/:path*",
    "/api/profiles/:path*/progress/:path*",
    "/api/membership/:path*",
    // Explicitly include from-make endpoint to ensure it's processed
    "/api/plans/from-make",
  ],
}
