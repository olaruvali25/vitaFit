import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"
import { isDowngradeAllowed, PROFILE_LIMITS, type SubscriptionTier } from "@/lib/subscription"
import { z } from "zod"

const schema = z.object({
  targetTier: z.enum(['free_trial', 'pro', 'plus', 'family']),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    const body = await req.json().catch(() => null)
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid subscription downgrade payload." },
        { status: 400 }
      )
    }
    const { targetTier } = parsed.data

    // Get current plan from profiles table
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const currentTier = (profile?.plan || 'free_trial') as SubscriptionTier

    if (!isDowngradeAllowed(currentTier, targetTier)) {
      return NextResponse.json(
        { error: "Downgrade path not allowed." },
        { status: 400 }
      )
    }

    // Count user's app profiles
    const { count: profileCount } = await supabaseAdmin
      .from('app_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const targetLimit = PROFILE_LIMITS[targetTier]

    if ((profileCount || 0) > targetLimit) {
      return NextResponse.json(
        { error: `Reduce profiles to ${targetLimit} before downgrading to ${targetTier}.` },
        { status: 400 }
      )
    }

    // Update plan in profiles table
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ plan: targetTier })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      message: "Subscription downgraded successfully.",
      subscriptionTier: targetTier,
    })
  } catch (error: any) {
    console.error("Subscription downgrade error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to downgrade subscription" },
      { status: 500 }
    )
  }
}
