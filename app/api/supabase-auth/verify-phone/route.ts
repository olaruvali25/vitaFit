import { NextRequest, NextResponse } from 'next/server'
import { verifyPhoneOTP } from '@/lib/supabase-auth'

export async function POST(request: NextRequest) {
  try {
    const { phone, token } = await request.json()

    if (!phone || !token) {
      return NextResponse.json(
        { error: 'Phone number and verification token are required' },
        { status: 400 }
      )
    }

    const result = await verifyPhoneOTP(phone, token)

    return NextResponse.json({
      message: 'Phone verified successfully',
      user: result.user ? {
        id: result.user.id,
        email: result.user.email,
        phone: result.user.phone
      } : null,
      session: result.session ? {
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
        expires_at: result.session.expires_at
      } : null
    })

  } catch (error: any) {
    console.error('Phone verification error:', error)

    if (error.message?.includes('Invalid token')) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    if (error.message?.includes('expired')) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Phone verification failed' },
      { status: 500 }
    )
  }
}
