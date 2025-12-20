import { NextRequest } from "next/server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers"
import { jsonError } from "./api-response"

/**
 * Get authentication context from Supabase session
 * Replaces the old Prisma + JWT based auth
 */
export async function getAuthContext(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
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

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { error: jsonError("UNAUTHORIZED", "Not authenticated.", 401) }
    }

    // Return user with empty profiles array (profiles are fetched separately via /api/profiles)
    return { 
      user: {
        id: user.id,
        email: user.email,
        role: (user.user_metadata?.role as string) || 'USER',
        subscriptionTier: 'free_trial' as const, // Default tier, will be fetched from profiles table
        profiles: [],
      },
      payload: { userId: user.id }
    }
  } catch (err: any) {
    console.error("Auth context error:", err)
    return { error: jsonError("UNAUTHORIZED", "Authentication failed.", 401) }
  }
}
