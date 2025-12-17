import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create a response to hold cookies during auth
    const cookieResponse = new NextResponse()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieResponse.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            cookieResponse.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Sign in with Supabase directly using the server client
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    if (!data.user) {
      throw new Error('Authentication failed')
    }

    // Create the final response with data and copy cookies from cookieResponse
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    })

    // Copy cookies from the cookie response to the final response
    cookieResponse.cookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, cookie)
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)

    if (error.message?.includes('Invalid login credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // TEMPORARILY DISABLED: Phone verification error handling for testing
    // if (error.message?.includes('Phone verification required')) {
    //   return NextResponse.json(
    //     { error: 'Phone verification required. Please complete signup first.' },
    //     { status: 403 }
    //   )
    // }

    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
