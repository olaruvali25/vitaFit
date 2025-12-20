import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"
import { isUpgradeAllowed, type SubscriptionTier } from "@/lib/subscription"
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
        { error: "Invalid subscription upgrade payload." },
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

    if (!isUpgradeAllowed(currentTier, targetTier)) {
      return NextResponse.json(
        { error: "Upgrade path not allowed." },
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
      message: "Subscription upgraded successfully.",
      subscriptionTier: targetTier,
    })
  } catch (error: any) {
    console.error("Subscription upgrade error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upgrade subscription" },
      { status: 500 }
    )
  }
}
