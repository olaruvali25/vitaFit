import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const updateSchema = z.object({
  dailyProgress: z.any().optional(),
  weeklyOverview: z.any().optional(),
  caloriesHistory: z.array(z.number()).optional(),
  workoutHistory: z.array(z.any()).optional(),
  hydrationHistory: z.array(z.number()).optional(),
  currentPlan: z.any().optional(),
  goalWeight: z.number().optional(),
  startWeight: z.number().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const user = await requireAuth()
    const { profileId } = await params

    // Verify the profile belongs to this user
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('app_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Return profile data as tracker (tracker data is stored in profile for now)
    return NextResponse.json({
      tracker: {
        id: profile.id,
        profileId: profile.id,
        dailyProgress: {},
        weeklyOverview: {},
        caloriesHistory: [],
        workoutHistory: [],
        hydrationHistory: [],
        currentPlan: {},
        goalWeight: profile.goal_weight || 0,
        startWeight: profile.weight_kg || 0,
      }
    })
  } catch (error: any) {
    console.error("Get tracker error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get tracker" },
      { status: error.statusCode || 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const user = await requireAuth()
    const { profileId } = await params

    // Verify the profile belongs to this user
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('app_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const body = await req.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tracker update payload" },
        { status: 400 }
      )
    }

    // Update goal_weight and weight_kg if provided
    const updates: any = { updated_at: new Date().toISOString() }
    if (parsed.data.goalWeight !== undefined) {
      updates.goal_weight = parsed.data.goalWeight
    }
    if (parsed.data.startWeight !== undefined) {
      updates.weight_kg = parsed.data.startWeight
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('app_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      tracker: {
        id: updated.id,
        profileId: updated.id,
        goalWeight: updated.goal_weight || 0,
        startWeight: updated.weight_kg || 0,
      }
    })
  } catch (error: any) {
    console.error("Update tracker error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update tracker" },
      { status: error.statusCode || 500 }
    )
  }
}
