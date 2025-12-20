import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

// Local type definition to replace Prisma import
type UserRole = 'USER' | 'ADMIN'

/**
 * Create Supabase server client for auth
 */
async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the full auth session
 * Returns null if not authenticated
 */
export async function getAuthSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
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

