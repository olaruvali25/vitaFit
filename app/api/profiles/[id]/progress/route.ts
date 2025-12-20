import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: profileId } = await params

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

    // Return basic progress data
    return NextResponse.json({
      profileId: profile.id,
      goalWeight: profile.goal_weight || 0,
      startWeight: profile.weight_kg || 0,
      currentWeight: profile.weight_kg || 0,
      progress: [],
    })
  } catch (error: any) {
    console.error("Get profile progress error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch progress" },
      { status: error.statusCode || 500 }
    )
  }
}
