import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Update plan to free_trial (effectively canceling)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ plan: 'free_trial' })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      message: "Subscription canceled. Access remains until period end.",
    })
  } catch (error: any) {
    console.error("Subscription cancel error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    )
  }
}
