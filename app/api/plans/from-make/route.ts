import { NextRequest, NextResponse } from "next/server"
import { generatePlan } from "@/lib/plan-generator"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * POST /api/plans/from-make
 * Webhook endpoint for Make.com to generate meal plans.
 */
export async function POST(request: NextRequest) {
  console.log("[Make.com Webhook] Request received")

  // Parse request body
  let body: any
  try {
    const rawBody = await request.text()
    if (!rawBody || rawBody.trim().length === 0) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    // Clean JSON (fix trailing commas)
    let cleanedBody = rawBody.trim()
    cleanedBody = cleanedBody.replace(/,(\s*[}\]])/g, '$1')
    body = JSON.parse(cleanedBody)
  } catch (parseError: any) {
    console.error("[Make.com Webhook] JSON parse error:", parseError.message)
    return NextResponse.json({ error: "Invalid JSON", message: parseError.message }, { status: 400 })
  }

  const {
    profileId,
    days = 7,
    caloriesTarget,
    proteinTargetG,
    fatTargetG,
    carbTargetG,
    workoutsPerWeek = 4,
    dietaryRestrictions,
    foodPreferences,
  } = body

  // Validate required fields
  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 })
  }
  if (!caloriesTarget || !proteinTargetG || !fatTargetG || !carbTargetG) {
    return NextResponse.json({ error: "Macro targets are required" }, { status: 400 })
  }

  // Validate profile exists in app_profiles
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('app_profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (profileError || !profile) {
    console.error("[Make.com Webhook] Profile not found:", profileId)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  console.log("[Make.com Webhook] Profile found:", profile.name)

  // Normalize arrays
  let dietaryRestrictionsArray: string[] = []
  if (Array.isArray(dietaryRestrictions)) {
    dietaryRestrictionsArray = dietaryRestrictions.filter((r: any) => typeof r === "string")
  } else if (typeof dietaryRestrictions === "string" && dietaryRestrictions.trim()) {
    dietaryRestrictionsArray = dietaryRestrictions.split(",").map((r: string) => r.trim()).filter(Boolean)
  }

  let foodPreferencesArray: string[] = []
  if (Array.isArray(foodPreferences)) {
    foodPreferencesArray = foodPreferences.filter((p: any) => typeof p === "string")
  } else if (typeof foodPreferences === "string" && foodPreferences.trim()) {
    foodPreferencesArray = [foodPreferences.trim()]
  }

  // Generate plan (returns data only, no database storage for now)
  try {
    const planData = await generatePlan({
      profileId: profileId.trim(),
      days: Number(days),
      caloriesTarget: Number(caloriesTarget),
      proteinTargetG: Number(proteinTargetG),
      fatTargetG: Number(fatTargetG),
      carbTargetG: Number(carbTargetG),
      workoutsPerWeek: Number(workoutsPerWeek) || 4,
      dietaryRestrictions: dietaryRestrictionsArray,
      foodPreferences: foodPreferencesArray,
    })

    console.log("[Make.com Webhook] Plan generated successfully!")

    return NextResponse.json({
      success: true,
      message: "Plan generated successfully",
      plan: planData,
    })
  } catch (genError: any) {
    console.error("[Make.com Webhook] Error generating plan:", genError)
    return NextResponse.json(
      { error: "Plan generation failed", message: genError.message },
      { status: 500 }
    )
  }
}
