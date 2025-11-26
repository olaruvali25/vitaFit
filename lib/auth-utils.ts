import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

/**
 * Get the full auth session
 * Returns null if not authenticated
 */
export async function getAuthSession() {
  return await auth()
}

// For API routes - throws error that can be caught and returned as JSON
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    const error: any = new Error("Unauthorized")
    error.statusCode = 401
    throw error
  }
  return user
}

// For page routes - redirects to login
export async function requireAuthPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if ((user as any).role !== "ADMIN") {
    redirect("/")
  }
  return user
}

export function isAdmin(userRole: UserRole | undefined): boolean {
  return userRole === "ADMIN"
}

