import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
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

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      // Continue anyway to clear cookies
    }

    // Create response and clear all auth cookies
    const response = NextResponse.json({ message: 'Logged out successfully' })
    
    // Clear all possible Supabase auth cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
    ]
    
    // Get all cookies and clear Supabase-related ones
    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
        response.cookies.delete(cookie.name)
        response.cookies.set(cookie.name, '', { 
          expires: new Date(0),
          path: '/',
          domain: undefined,
        })
      }
    })

    return response

  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    )
  }
}
