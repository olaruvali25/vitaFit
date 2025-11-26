import { NextResponse } from "next/server"
import { requireAuth } from "./auth-utils"

/**
 * Helper to safely call requireAuth in API routes
 * Returns null if unauthorized, which should be handled by the caller
 */
export async function getAuthUser() {
  try {
    return await requireAuth()
  } catch (error: any) {
    if (error.statusCode === 401) {
      return null
    }
    throw error
  }
}

/**
 * Wrapper for API routes that require authentication
 * Returns JSON error response if unauthorized
 */
export async function withAuth<T>(
  handler: (user: any) => Promise<T>
): Promise<NextResponse<T> | NextResponse<{ error: string }>> {
  try {
    const user = await requireAuth()
    const result = await handler(user)
    return result as NextResponse<T>
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ) as NextResponse<{ error: string }>
    }
    throw error
  }
}

