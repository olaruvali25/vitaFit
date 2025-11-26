import { NextRequest, NextResponse } from "next/server"
import { generatePlan } from "@/lib/plan-generator"
import { getUserMembership } from "@/lib/membership"
import { prisma } from "@/lib/prisma"

// Optional webhook secret for security (set in environment variables)
const WEBHOOK_SECRET = process.env.MAKE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  console.log("=".repeat(80))
  console.log("[Make.com Webhook] ====== NEW REQUEST RECEIVED ======")
  console.log("[Make.com Webhook] Headers:", JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2))
  console.log("[Make.com Webhook] URL:", request.url)
  console.log("=".repeat(80))
  
  try {
    // Optional: Verify webhook secret if provided
    const authHeader = request.headers.get("authorization")
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      // Allow if no secret is configured (for development)
      // In production, uncomment this:
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate request payload
    let body
    try {
      const rawBody = await request.text()
      console.log("[Make.com Webhook] Raw body received (length):", rawBody.length)
      console.log("[Make.com Webhook] Raw body (full):", rawBody)
      
      // Try to fix common JSON issues from Make.com
      let cleanedBody = rawBody.trim()
      
      // Remove trailing comma before closing brace/bracket (multiple times to catch nested issues)
      cleanedBody = cleanedBody.replace(/,(\s*[}\]])/g, '$1')
      cleanedBody = cleanedBody.replace(/,(\s*[}\]])/g, '$1') // Run twice to catch nested commas
      
      // Remove any trailing commas after last property
      cleanedBody = cleanedBody.replace(/,(\s*})/g, '$1')
      
      // Fix unquoted property names (if Make.com sends them)
      cleanedBody = cleanedBody.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      
      // Try to parse
      try {
        body = JSON.parse(cleanedBody)
        console.log("[Make.com Webhook] Successfully parsed body on first try")
      } catch (firstParseError: any) {
        console.log("[Make.com Webhook] First parse failed:", firstParseError.message)
        console.log("[Make.com Webhook] Attempting to extract and fix JSON...")
        
        // Try to find JSON object in the string
        const jsonMatch = cleanedBody.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          let extractedJson = jsonMatch[0]
          
          // More aggressive cleaning
          extractedJson = extractedJson.replace(/,(\s*[}\]])/g, '$1')
          extractedJson = extractedJson.replace(/,(\s*[}\]])/g, '$1')
          
          try {
            body = JSON.parse(extractedJson)
            console.log("[Make.com Webhook] Successfully parsed extracted JSON")
          } catch (extractError: any) {
            console.error("[Make.com Webhook] Extracted JSON still invalid:", extractError.message)
            
            // Last resort: try to manually extract key fields
            console.log("[Make.com Webhook] Attempting manual field extraction...")
            const manualBody: any = {}
            
            // Extract profileId
            const profileIdMatch = rawBody.match(/"profileId"\s*:\s*"([^"]+)"/) || rawBody.match(/profileId["\s]*:["\s]*([^",\s}]+)/)
            if (profileIdMatch) manualBody.profileId = profileIdMatch[1]
            
            // Extract numeric fields
            const extractNumber = (field: string) => {
              const match = rawBody.match(new RegExp(`"${field}"\\s*:\\s*(\\d+(?:\\.\\d+)?)`, 'i')) || 
                           rawBody.match(new RegExp(`${field}["\\s]*:["\\s]*(\\d+(?:\\.\\d+)?)`, 'i'))
              return match ? parseFloat(match[1]) : null
            }
            
            manualBody.caloriesTarget = extractNumber('caloriesTarget')
            manualBody.proteinTargetG = extractNumber('proteinTargetG')
            manualBody.fatTargetG = extractNumber('fatTargetG')
            manualBody.carbTargetG = extractNumber('carbTargetG')
            manualBody.workoutsPerWeek = extractNumber('workoutsPerWeek') || 4
            manualBody.days = extractNumber('days') || 7
            
            // Extract arrays
            const extractArray = (field: string) => {
              const match = rawBody.match(new RegExp(`"${field}"\\s*:\\s*\\[([^\\]]+)\\]`, 'i'))
              if (match) {
                return match[1].split(',').map(s => s.trim().replace(/["']/g, '')).filter(Boolean)
              }
              return []
            }
            
            manualBody.dietaryRestrictions = extractArray('dietaryRestrictions')
            manualBody.foodPreferences = extractArray('foodPreferences')
            
            if (manualBody.profileId && manualBody.caloriesTarget) {
              console.log("[Make.com Webhook] Using manually extracted data:", manualBody)
              body = manualBody
            } else {
              throw extractError
            }
          }
        } else {
          throw firstParseError
        }
      }
      
      console.log("[Make.com Webhook] Successfully parsed body:", JSON.stringify(body, null, 2))
    } catch (parseError: any) {
      console.error("[Make.com Webhook] JSON parse error:", parseError.message)
      console.error("[Make.com Webhook] Error at position:", parseError.message.match(/position (\d+)/)?.[1])
      console.error("[Make.com Webhook] Full raw body:", rawBody)
      
      return NextResponse.json(
        { 
          error: `Invalid JSON: ${parseError.message}. Please check your Make.com HTTP request body format.`,
          hint: "Make sure the HTTP Request module in Make.com sends valid JSON without trailing commas."
        },
        { status: 400 }
      )
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

    // Normalize dietaryRestrictions and foodPreferences to arrays
    let dietaryRestrictionsArray: string[] = []
    if (Array.isArray(dietaryRestrictions)) {
      dietaryRestrictionsArray = dietaryRestrictions
    } else if (typeof dietaryRestrictions === "string" && dietaryRestrictions.trim()) {
      dietaryRestrictionsArray = dietaryRestrictions.split(",").map(r => r.trim()).filter(Boolean)
    }

    let foodPreferencesArray: string[] = []
    if (Array.isArray(foodPreferences)) {
      foodPreferencesArray = foodPreferences
    } else if (typeof foodPreferences === "string" && foodPreferences.trim()) {
      foodPreferencesArray = [foodPreferences.trim()]
    }

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
        dietaryRestrictions: dietaryRestrictionsArray,
        foodPreferences: foodPreferencesArray,
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
    console.error("Error stack:", error.stack)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate plan",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

