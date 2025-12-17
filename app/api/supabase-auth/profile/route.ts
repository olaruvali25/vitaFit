import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserProfile } from '@/lib/supabase-auth'

export async function GET(request: NextRequest) {
  try {
    const profile = await getCurrentUserProfile()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })

  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
