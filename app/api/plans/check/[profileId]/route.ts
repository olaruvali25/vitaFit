import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const user = await requireAuth()
    const { profileId } = await params

    // Verify profile belongs to user
    const { data: profile, error } = await supabaseAdmin
      .from('app_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Plan checking - for now return no active plan
    // Full implementation requires plans table in Supabase
    return NextResponse.json({
      hasActivePlan: false,
      profileId,
      message: "Plan storage is being migrated to Supabase"
    })
  } catch (error: any) {
    console.error("Check plan error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to check plan" },
      { status: error.statusCode || 500 }
    )
  }
}
