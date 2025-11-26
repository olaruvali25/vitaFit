import { NextRequest, NextResponse } from "next/server"
import { generatePlan } from "@/lib/plan-generator"
import { getUserMembership } from "@/lib/membership"
import { prisma } from "@/lib/prisma"

// Optional webhook secret for security (set in environment variables)
const WEBHOOK_SECRET = process.env.MAKE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook secret if provided
    const authHeader = request.headers.get("authorization")
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      // Allow if no secret is configured (for development)
      // In production, uncomment this:
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate request payload
    const body = await request.json()

    const {
      profileId,
      days = 7,
      caloriesTarget,
      proteinTargetG,
      fatTargetG,
      carbTargetG,
      workoutsPerWeek = 4,
      dietaryRestrictions = [],
      foodPreferences = [],
    } = body

    // Validate required fields
    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 })
    }

    if (!caloriesTarget || !proteinTargetG || !fatTargetG || !carbTargetG) {
      return NextResponse.json(
        { error: "All macro targets (caloriesTarget, proteinTargetG, fatTargetG, carbTargetG) are required" },
        { status: 400 }
      )
    }

    // Validate profile exists and get user
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { user: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check membership status (allow webhook to bypass for plan generation)
    // Users can still be on trial or have active membership
    // Note: Webhook can generate plans even for users without active membership
    // The UI will handle showing upgrade prompts if needed

    // Validate days
    if (days < 1 || days > 30) {
      return NextResponse.json({ error: "days must be between 1 and 30" }, { status: 400 })
    }

    // Validate macros are positive
    if (
      caloriesTarget <= 0 ||
      proteinTargetG <= 0 ||
      fatTargetG <= 0 ||
      carbTargetG <= 0
    ) {
      return NextResponse.json({ error: "All macro targets must be positive" }, { status: 400 })
    }

    console.log(`[Make.com Webhook] Starting plan generation for profileId: ${profileId}`)
    console.log(`[Make.com Webhook] Macros received:`, {
      caloriesTarget,
      proteinTargetG,
      fatTargetG,
      carbTargetG,
      workoutsPerWeek,
      days,
    })

    // Generate the plan
    let plan
    try {
      plan = await generatePlan({
        profileId,
        days,
        caloriesTarget: Number(caloriesTarget),
        proteinTargetG: Number(proteinTargetG),
        fatTargetG: Number(fatTargetG),
        carbTargetG: Number(carbTargetG),
        workoutsPerWeek: Number(workoutsPerWeek),
        dietaryRestrictions: Array.isArray(dietaryRestrictions) ? dietaryRestrictions : [],
        foodPreferences: Array.isArray(foodPreferences) ? foodPreferences : [],
      })
      
      console.log(`[Make.com Webhook] Plan generated successfully! Plan ID: ${plan.id}`)
      console.log(`[Make.com Webhook] Plan has ${plan.days?.length || 0} days`)
      
      // Verify plan was created correctly
      if (!plan.id) {
        throw new Error("Plan was created but has no ID")
      }
      
      if (!plan.days || plan.days.length === 0) {
        throw new Error("Plan was created but has no days")
      }
      
      const totalMeals = plan.days.reduce((sum: number, day: any) => sum + (day.meals?.length || 0), 0)
      console.log(`[Make.com Webhook] Plan has ${totalMeals} total meals`)
      
      if (totalMeals === 0) {
        throw new Error("Plan was created but has no meals")
      }
      
    } catch (genError: any) {
      console.error(`[Make.com Webhook] Error generating plan:`, genError)
      throw new Error(`Failed to generate plan: ${genError.message}`)
    }

    // Return success response with plan ID
    return NextResponse.json({
      success: true,
      message: "Plan generated successfully",
      planId: plan.id,
      profileId: plan.profileId,
      plan: {
        id: plan.id,
        profileId: plan.profileId,
        title: plan.title,
        startDate: plan.startDate,
        endDate: plan.endDate,
        caloriesTarget: plan.caloriesTarget,
        proteinTargetG: plan.proteinTargetG,
        fatTargetG: plan.fatTargetG,
        carbTargetG: plan.carbTargetG,
        workoutsPerWeek: plan.workoutsPerWeek,
        daysCount: plan.days?.length || 0,
        mealsCount: plan.days?.reduce((sum: number, day: any) => sum + (day.meals?.length || 0), 0) || 0,
      },
    })
  } catch (error: any) {
    console.error("Error generating plan from Make.com webhook:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate plan" },
      { status: 500 }
    )
  }
}

