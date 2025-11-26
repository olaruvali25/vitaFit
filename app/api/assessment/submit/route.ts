import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import type { AssessmentFormData } from "@/components/forms/AssessmentForm"

const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/6gf31px9yw2lv6voo7oun6h7lfym3xqa"
const VITAFIT_API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    // Note: This endpoint should be accessible, but we check auth inside
    const session = await getAuthSession()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to continue." },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const formData = body as AssessmentFormData

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.age || !formData.gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Parse dietary restrictions (comma-separated string to array)
    const dietaryRestrictions = formData.dietaryRestrictions
      ? formData.dietaryRestrictions.split(",").map((r) => r.trim()).filter(Boolean)
      : []

    // Parse food preferences from activity level and other fields
    const foodPreferences: string[] = []
    if (formData.activityLevel?.toLowerCase().includes("active")) {
      foodPreferences.push("high-protein")
    }
    if (formData.mealPrepDuration === "15-30 minutes" || formData.mealPrepDuration === "30-45 minutes") {
      foodPreferences.push("simple", "easy-to-cook")
    }

    // Create or find user profile
    let profile = await prisma.profile.findFirst({
      where: {
        userId,
        name: formData.fullName,
      },
    })

    if (!profile) {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId,
          name: formData.fullName,
          age: parseInt(formData.age) || null,
          gender: formData.gender || null,
          heightCm: parseFloat(formData.heightCm) || null,
          weightKg: parseFloat(formData.weightKg) || null,
          goal: formData.goal || null,
          goalWeight: parseFloat(formData.goalWeight) || null,
          activityLevel: formData.activityLevel || null,
          timeline: formData.timeline || null,
          dietaryRestrictions: formData.dietaryRestrictions || null,
          workoutDays: formData.workoutDays || null,
          workoutDuration: formData.workoutDuration || null,
          mealPrepDuration: formData.mealPrepDuration || null,
        },
      })
    } else {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          age: parseInt(formData.age) || profile.age,
          gender: formData.gender || profile.gender,
          heightCm: parseFloat(formData.heightCm) || profile.heightCm,
          weightKg: parseFloat(formData.weightKg) || profile.weightKg,
          goal: formData.goal || profile.goal,
          goalWeight: parseFloat(formData.goalWeight) || profile.goalWeight,
          activityLevel: formData.activityLevel || profile.activityLevel,
          timeline: formData.timeline || profile.timeline,
          dietaryRestrictions: formData.dietaryRestrictions || profile.dietaryRestrictions,
          workoutDays: formData.workoutDays || profile.workoutDays,
          workoutDuration: formData.workoutDuration || profile.workoutDuration,
          mealPrepDuration: formData.mealPrepDuration || profile.mealPrepDuration,
        },
      })
    }

    // Prepare data to send to Make.com
    const makePayload = {
      // User/Profile info
      profileId: profile.id,
      userId: userId,
      email: formData.email,
      name: formData.fullName,
      
      // Body metrics
      age: parseInt(formData.age),
      gender: formData.gender,
      weightKg: parseFloat(formData.weightKg),
      weightLbs: parseFloat(formData.weightLbs),
      heightCm: parseFloat(formData.heightCm),
      heightFt: formData.heightFt,
      
      // Goals
      goal: formData.goal,
      goalWeight: parseFloat(formData.goalWeight),
      timeline: formData.timeline,
      
      // Activity & Lifestyle
      activityLevel: formData.activityLevel,
      workoutDays: parseInt(formData.workoutDays) || 4,
      workoutDuration: formData.workoutDuration,
      mealPrepDuration: formData.mealPrepDuration,
      
      // Dietary info
      dietaryRestrictions: dietaryRestrictions,
      foodPreferences: foodPreferences,
      
      // Callback URL for Make.com to send results back
      callbackUrl: `${VITAFIT_API_BASE_URL}/api/plans/from-make`,
    }

    // Send data to Make.com webhook
    // Make.com will process the data and call /api/plans/from-make with the calculated macros
    try {
      const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(makePayload),
      })

      if (!makeResponse.ok) {
        const errorText = await makeResponse.text()
        console.error("Make.com webhook error:", errorText)
        // Don't fail the request - Make.com will retry or we can handle it later
      } else {
        console.log("Assessment data sent to Make.com successfully")
        // Make.com will process and call /api/plans/from-make with calculated macros
      }
    } catch (error) {
      console.error("Error calling Make.com webhook:", error)
      // Continue anyway - Make.com might process it asynchronously
    }

    // Check membership status
    const { getUserMembership } = await import("@/lib/membership")
    const membership = await getUserMembership(userId)

    // Return success response with membership info
    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully. Your plan will be generated shortly.",
      profileId: profile.id,
      membership: {
        hasActiveMembership: membership?.canUseFeatures || false,
        status: membership?.status || "INACTIVE",
        plan: membership?.plan || null,
      },
      // If Make.com returns data synchronously, include it here
      // Otherwise, Make.com will call /api/plans/from-make directly
    })
  } catch (error: any) {
    console.error("Assessment submit error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit assessment" },
      { status: 500 }
    )
  }
}

