import { NextRequest, NextResponse } from "next/server"
import { getAuthSession, requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"
import type { AssessmentFormData } from "@/components/forms/AssessmentForm"

const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/6gf31px9yw2lv6voo7oun6h7lfym3xqa"
const VITAFIT_API_BASE_URL = 
  process.env.NEXT_PUBLIC_APP_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "http://localhost:3000"

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    let user
    try {
      user = await requireAuth()
    } catch (error) {
      console.error("[Assessment Submit] Auth check error:", error)
      return NextResponse.json(
        { error: "Authentication required. Please sign in to continue." },
        { status: 401 }
      )
    }

    const userId = user.id
    const body = await request.json()
    const formData = body as AssessmentFormData

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.age || !formData.gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Parse dietary restrictions
    const dietaryRestrictions = formData.dietaryRestrictions
      ? formData.dietaryRestrictions.split(",").map((r) => r.trim()).filter(Boolean)
      : []

    // Parse food preferences
    const foodPreferences: string[] = []
    if (formData.activityLevel?.toLowerCase().includes("active")) {
      foodPreferences.push("high-protein")
    }
    if (formData.mealPrepDuration === "15-30 minutes" || formData.mealPrepDuration === "30-45 minutes") {
      foodPreferences.push("simple", "easy-to-cook")
    }

    // Find existing profile for this user with this name
    const { data: existingProfile } = await supabaseAdmin
      .from('app_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('name', formData.fullName)
      .single()

    let profile

    if (!existingProfile) {
      // Create new profile
      const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.fullName)}`
      
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('app_profiles')
        .insert({
          user_id: userId,
          name: formData.fullName,
          profile_picture: profilePicture,
          age: parseInt(formData.age) || null,
          gender: formData.gender || null,
          height_cm: parseFloat(formData.heightCm) || null,
          weight_kg: parseFloat(formData.weightKg) || null,
          goal: formData.goal || null,
          goal_weight: parseFloat(formData.goalWeight) || null,
          activity_level: formData.activityLevel || null,
          timeline: formData.timeline || null,
          dietary_restrictions: formData.dietaryRestrictions || null,
          workout_days: formData.workoutDays || null,
          workout_duration: formData.workoutDuration || null,
          meal_prep_duration: formData.mealPrepDuration || null,
        })
        .select()
        .single()

      if (createError) {
        console.error("[Assessment Submit] Error creating profile:", createError)
        throw createError
      }
      profile = newProfile
    } else {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('app_profiles')
        .update({
          age: parseInt(formData.age) || existingProfile.age,
          gender: formData.gender || existingProfile.gender,
          height_cm: parseFloat(formData.heightCm) || existingProfile.height_cm,
          weight_kg: parseFloat(formData.weightKg) || existingProfile.weight_kg,
          goal: formData.goal || existingProfile.goal,
          goal_weight: parseFloat(formData.goalWeight) || existingProfile.goal_weight,
          activity_level: formData.activityLevel || existingProfile.activity_level,
          timeline: formData.timeline || existingProfile.timeline,
          dietary_restrictions: formData.dietaryRestrictions || existingProfile.dietary_restrictions,
          workout_days: formData.workoutDays || existingProfile.workout_days,
          workout_duration: formData.workoutDuration || existingProfile.workout_duration,
          meal_prep_duration: formData.mealPrepDuration || existingProfile.meal_prep_duration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id)
        .select()
        .single()

      if (updateError) {
        console.error("[Assessment Submit] Error updating profile:", updateError)
        throw updateError
      }
      profile = updatedProfile
    }

    // Prepare data for Make.com
    const makePayload = {
      profileId: profile.id,
      userId: userId,
      email: formData.email,
      name: formData.fullName,
      age: parseInt(formData.age),
      gender: formData.gender,
      weightKg: parseFloat(formData.weightKg),
      weightLbs: parseFloat(formData.weightLbs),
      heightCm: parseFloat(formData.heightCm),
      heightFt: formData.heightFt,
      goal: formData.goal,
      goalWeight: parseFloat(formData.goalWeight),
      timeline: formData.timeline,
      goalIntensity: formData.goalIntensity,
      activityLevel: formData.activityLevel,
      workoutDays: parseInt(formData.workoutDays) || 4,
      workoutDuration: formData.workoutDuration,
      mealPrepDuration: formData.mealPrepDuration,
      workoutDaysMulti: formData.workoutDaysMulti || [],
      trainingTimeOfDay: formData.trainingTimeOfDay || [],
      dailyRoutine: formData.dailyRoutine,
      sleepQuality: formData.sleepQuality,
      stressLevel: formData.stressLevel,
      waterIntake: formData.waterIntake,
      dietaryRestrictions: dietaryRestrictions,
      foodPreferences: foodPreferences,
      eatingSchedule: formData.eatingSchedule,
      foodPrepPreference: formData.foodPrepPreference,
      callbackUrl: `${VITAFIT_API_BASE_URL}/api/plans/from-make`,
    }

    // Send to Make.com webhook
    console.log("[Assessment Submit] Sending data to Make.com webhook...")
    try {
      const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(makePayload),
      })

      if (!makeResponse.ok) {
        console.error("[Assessment Submit] Make.com webhook error:", await makeResponse.text())
      } else {
        console.log("[Assessment Submit] Make.com webhook success!")
      }
    } catch (error: any) {
      console.error("[Assessment Submit] Error calling Make.com:", error.message)
    }

    // Get membership info
    const { getUserMembership } = await import("@/lib/membership")
    const membership = await getUserMembership(userId)

    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully. Your plan will be generated shortly.",
      profileId: profile.id,
      membership: {
        hasActiveMembership: membership?.canUseFeatures || false,
        status: membership?.status || "INACTIVE",
        plan: membership?.plan || null,
      },
    })
  } catch (error: any) {
    console.error("Assessment submit error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit assessment" },
      { status: 500 }
    )
  }
}
