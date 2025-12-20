import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'

  if (code) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user to ensure profile exists
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check/create profile for OAuth user
        const supabaseAdmin = (await import('@/lib/supabase')).supabaseAdmin
        if (supabaseAdmin) {
          const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single()

          if (!existingProfile) {
            // Create profile for OAuth user
            await supabaseAdmin.from('profiles').insert({
              id: user.id,
              email: user.email || '',
              phone: user.phone || null,
              phone_verified: true, // OAuth users are considered verified
              plan: 'free trial',
              profiles_limit: 1,
            })
          }
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth_error`)
}

