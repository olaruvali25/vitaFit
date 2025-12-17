/**
 * NextAuth API Route Handler
 * 
 * This exports the GET and POST handlers from auth.ts
 * which are used by Auth.js to handle authentication requests.
 */

// Re-export handlers lazily so import-time errors in auth.ts are caught and returned as JSON.
// This prevents Next from returning HTML error pages that break the Auth.js client JSON parsing.
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const module = await import("@/auth")
    // @ts-ignore
    if (!module?.handlers?.GET) {
      throw new Error("Auth handlers not found")
    }
    // @ts-ignore
    return await module.handlers.GET(request)
  } catch (error) {
    console.error("[Auth Route] GET handler import/exec error:", error)
    return new Response(JSON.stringify({
      error: "Authentication GET handler error",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request: Request) {
  try {
    const module = await import("@/auth")
    // @ts-ignore
    if (!module?.handlers?.POST) {
      throw new Error("Auth handlers not found")
    }
    // @ts-ignore
    return await module.handlers.POST(request)
  } catch (error) {
    console.error("[Auth Route] POST handler import/exec error:", error)
    return new Response(JSON.stringify({
      error: "Authentication POST handler error",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}