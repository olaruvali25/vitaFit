import { NextRequest, NextResponse } from 'next/server'
import { canCreateProfile } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await canCreateProfile(user.id)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Check profile creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check profile creation limits' },
      { status: 500 }
    )
  }
}
