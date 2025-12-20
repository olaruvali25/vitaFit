import { NextRequest, NextResponse } from 'next/server'
import { validatePhoneNumber } from '@/lib/supabase-auth'
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

    // Check Supabase admin client
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set up environment variables.' },
        { status: 500 }
      )
    }

    // Validate phone format if provided
    if (phone && !validatePhoneNumber(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use E.164 format (e.g., +40712345678)' },
        { status: 400 }
      )
    }

    // Create confirmed user via Admin API
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: phone || undefined,
      email_confirm: true,
      user_metadata: { phone: phone || null }
    })

    if (createError) {
      console.error('Supabase admin createUser error:', createError)
      
      // Handle specific errors
      if (createError.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: createError.message || 'Failed to create user' },
        { status: 500 }
      )
    }

    const createdUser = createData.user

    // Create profile for the user
    if (createdUser) {
      try {
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: createdUser.id,
            email,
            phone: phone || null,
            phone_verified: true, // Mark as verified for testing
            plan: 'free trial',
            profiles_limit: 1
          }, { onConflict: 'id' })

        if (profileError) {
          console.error('Profile upsert error:', profileError)
        }
      } catch (e) {
        console.error('Failed to upsert profile:', e)
      }
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: createdUser ? {
        id: createdUser.id,
        email: createdUser.email,
        phone: createdUser.phone
      } : null
    }, { status: 200 })

  } catch (error: any) {
    console.error('Signup error:', error)

    if (error.message?.includes('already registered')) {
      return NextResponse.json(
        { error: 'An account with this email or phone number already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}
