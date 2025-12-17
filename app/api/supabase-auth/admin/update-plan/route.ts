import { NextRequest, NextResponse } from 'next/server'
import { updateUserPlan } from '@/lib/supabase-auth'
import { supabaseAdmin } from '@/lib/supabase'

// This endpoint should be protected and only accessible by admins
export async function POST(request: NextRequest) {
  try {
    // Verify admin access (implement proper admin authentication)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, plan } = await request.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'userId and plan are required' },
        { status: 400 }
      )
    }

    const validPlans = ['free trial', 'pro', 'plus', 'family']
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    await updateUserPlan(userId, plan as any)

    return NextResponse.json({
      message: 'Plan updated successfully',
      userId,
      plan
    })

  } catch (error: any) {
    console.error('Update plan error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update plan' },
      { status: 500 }
    )
  }
}
