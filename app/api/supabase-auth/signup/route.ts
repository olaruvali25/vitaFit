import { NextRequest, NextResponse } from 'next/server'
import { validatePhoneNumber, getPhoneNumberRequirements } from '@/lib/supabase-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !phone) {
      return NextResponse.json(
        { error: 'Email, password, and phone number are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      )
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      )
    }

    // For testing: allow signup without enforcing phone verification.
    // Use Supabase Admin client to create a confirmed user and create a profile row so the account
    // immediately exists in Supabase and can be used for testing.
    // If Supabase admin client not configured, fallback to local storage for testing
    if (!supabaseAdmin) {
      try {
        const { createLocalUser } = await import('@/lib/local-auth')
        const user = await createLocalUser(email, password, phone || undefined)
        return NextResponse.json({
          message: 'Signup successful (local testing mode). Account created locally.',
          user
        }, { status: 200 })
      } catch (e: any) {
        console.error('Local signup error:', e)
        return NextResponse.json({ error: e?.message || 'Failed to create local user' }, { status: 500 })
      }
    }

    // If phone is provided, validate its format, but do not require verification.
    if (phone && !validatePhoneNumber(phone)) {
      return NextResponse.json(
        {
          error: 'Invalid phone number format. Provide E.164 (e.g., +40712345678) or leave blank for testing.'
        },
        { status: 400 }
      )
    }

    // Create confirmed user via Admin API so email/phone are treated as verified for testing.
    const createRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: phone || undefined,
      email_confirm: true,
      user_metadata: { phone: phone || null }
    })

    if (createRes.error) {
      console.error('Supabase admin createUser error:', createRes.error)
      return NextResponse.json({ error: createRes.error.message || 'Failed to create user' }, { status: 500 })
    }

    const createdUser = createRes.user

    // Ensure a profile exists for the user (create or upsert). Mark phone_verified true for testing.
    try {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: createdUser?.id,
          email,
          phone: phone || null,
          phone_verified: true,
          plan: 'free trial',
          profiles_limit: 1
        }, { onConflict: 'id' })

      if (profileError) {
        console.error('Profile upsert error:', profileError)
      }
    } catch (e) {
      console.error('Failed to upsert profile:', e)
    }

    return NextResponse.json({
      message: 'Signup successful (testing mode). Account created and confirmed.',
      user: createdUser ? {
        id: createdUser.id,
        email: createdUser.email,
        phone: createdUser.phone
      } : null
    }, { status: 200 })

  } catch (error: any) {
    console.error('Signup error:', error)

    // Handle specific Supabase errors
    if (error.message?.includes('already registered')) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 400 }
      )
    }

    if (error.message?.includes('Invalid login credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}
