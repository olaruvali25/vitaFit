import { NextRequest, NextResponse } from "next/server"
import { generatePlan } from "@/lib/plan-generator"
import { prisma } from "@/lib/prisma"

// Optional webhook secret for security (set in environment variables)
const WEBHOOK_SECRET = process.env.MAKE_WEBHOOK_SECRET

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * POST /api/plans/from-make
 * 
 * Webhook endpoint for Make.com to generate meal plans.
 * 
 * Expected payload from Make.com:
 * {
 *   "profileId": "string (cuid)",
 *   "caloriesTarget": number,
 *   "proteinTargetG": number,
 *   "fatTargetG": number,
 *   "carbTargetG": number,
 *   "workoutsPerWeek": number (optional, default: 4),
 *   "days": number (optional, default: 7),
 *   "dietaryRestrictions": string[] | string (optional),
 *   "foodPreferences": string[] | string (optional)
 * }
 */
export async function POST(request: NextRequest) {
  console.log("=".repeat(80))
  console.log("[Make.com Webhook] ====== NEW REQUEST RECEIVED ======")
  console.log("[Make.com Webhook] Timestamp:", new Date().toISOString())
  console.log("[Make.com Webhook] URL:", request.url)
  console.log("[Make.com Webhook] Method:", request.method)
  console.log("[Make.com Webhook] Headers:", JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2))
  console.log("=".repeat(80))

  // Step 1: Verify environment variables
  try {
    if (!process.env.DATABASE_URL) {
      console.error("[Make.com Webhook] ❌ Missing DATABASE_URL environment variable")
      return NextResponse.json(
        { 
          error: "Server configuration error",
          message: "Missing DATABASE_URL environment variable",
          details: "The database connection string is not configured"
        },
        { status: 500 }
      )
    }
    console.log("[Make.com Webhook] ✅ DATABASE_URL is configured")
  } catch (envError: any) {
    console.error("[Make.com Webhook] ❌ Error checking environment variables:", envError)
    return NextResponse.json(
      { 
        error: "Server configuration error",
        message: envError.message || "Failed to verify environment configuration"
      },
      { status: 500 }
    )
  }

  // Step 2: Verify Prisma client is initialized
  try {
    await prisma.$connect()
    console.log("[Make.com Webhook] ✅ Prisma client connected successfully")
  } catch (prismaError: any) {
    console.error("[Make.com Webhook] ❌ Prisma connection error:", prismaError)
    console.error("[Make.com Webhook] Error details:", {
      message: prismaError.message,
      code: prismaError.code,
      meta: prismaError.meta,
    })
    return NextResponse.json(
      { 
        error: "Database connection error",
        message: prismaError.message || "Failed to connect to database",
        details: process.env.NODE_ENV === "development" ? prismaError.stack : undefined
      },
      { status: 500 }
    )
  }

  // Step 3: Optional webhook secret verification
  try {
    const authHeader = request.headers.get("authorization")
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.warn("[Make.com Webhook] ⚠️ Webhook secret mismatch (if configured, this would be unauthorized)")
      // Allow if no secret is configured (for development)
      // In production, uncomment this:
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  } catch (authError: any) {
    console.error("[Make.com Webhook] ❌ Auth verification error:", authError)
    // Continue - auth is optional
  }

  // Step 4: Parse and validate request body
  let body: any = null
  let rawBody = ""
  
  try {
    rawBody = await request.text()
    console.log("[Make.com Webhook] Raw body received (length):", rawBody.length)
    console.log("[Make.com Webhook] Raw body (first 500 chars):", rawBody.substring(0, 500))
    
    if (!rawBody || rawBody.trim().length === 0) {
      console.error("[Make.com Webhook] ❌ Empty request body")
      return NextResponse.json(
        { 
          error: "Invalid request",
          message: "Request body is empty",
          hint: "Make.com HTTP Request module must send a JSON body"
        },
        { status: 400 }
      )
    }

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
      console.log("[Make.com Webhook] ✅ Successfully parsed body on first try")
    } catch (firstParseError: any) {
      console.log("[Make.com Webhook] ⚠️ First parse failed:", firstParseError.message)
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
          console.log("[Make.com Webhook] ✅ Successfully parsed extracted JSON")
        } catch (extractError: any) {
          console.error("[Make.com Webhook] ❌ Extracted JSON still invalid:", extractError.message)
          
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
            console.log("[Make.com Webhook] ✅ Using manually extracted data")
            body = manualBody
          } else {
            throw extractError
          }
        }
      } else {
        throw firstParseError
      }
    }
    
    console.log("[Make.com Webhook] ✅ Successfully parsed body:", JSON.stringify(body, null, 2))
  } catch (parseError: any) {
    console.error("[Make.com Webhook] ❌ JSON parse error:", parseError.message)
    console.error("[Make.com Webhook] Error at position:", parseError.message.match(/position (\d+)/)?.[1])
    console.error("[Make.com Webhook] Full raw body:", rawBody)
    
    return NextResponse.json(
      { 
        error: "Invalid JSON",
        message: parseError.message || "Failed to parse request body",
        hint: "Make sure the HTTP Request module in Make.com sends valid JSON without trailing commas.",
        rawBodyPreview: rawBody.substring(0, 200)
      },
      { status: 400 }
    )
  }

  // Step 5: Extract and validate required fields
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
  if (!profileId || typeof profileId !== "string" || profileId.trim().length === 0) {
    console.error("[Make.com Webhook] ❌ Missing or invalid profileId")
    return NextResponse.json(
      { 
        error: "Validation error",
        message: "profileId is required and must be a non-empty string",
        received: { profileId: body.profileId }
      },
      { status: 400 }
    )
  }

  if (!caloriesTarget || typeof caloriesTarget !== "number" || caloriesTarget <= 0) {
    console.error("[Make.com Webhook] ❌ Missing or invalid caloriesTarget")
    return NextResponse.json(
      { 
        error: "Validation error",
        message: "caloriesTarget is required and must be a positive number",
        received: { caloriesTarget: body.caloriesTarget }
      },
      { status: 400 }
    )
  }

  if (!proteinTargetG || typeof proteinTargetG !== "number" || proteinTargetG <= 0) {
    console.error("[Make.com Webhook] ❌ Missing or invalid proteinTargetG")
    return NextResponse.json(
      { 
        error: "Validation error",
        message: "proteinTargetG is required and must be a positive number",
        received: { proteinTargetG: body.proteinTargetG }
      },
      { status: 400 }
    )
  }

  if (!fatTargetG || typeof fatTargetG !== "number" || fatTargetG <= 0) {
    console.error("[Make.com Webhook] ❌ Missing or invalid fatTargetG")
    return NextResponse.json(
      { 
        error: "Validation error",
        message: "fatTargetG is required and must be a positive number",
        received: { fatTargetG: body.fatTargetG }
      },
      { status: 400 }
    )
  }

  if (!carbTargetG || typeof carbTargetG !== "number" || carbTargetG <= 0) {
    console.error("[Make.com Webhook] ❌ Missing or invalid carbTargetG")
    return NextResponse.json(
      { 
        error: "Validation error",
        message: "carbTargetG is required and must be a positive number",
        received: { carbTargetG: body.carbTargetG }
      },
      { status: 400 }
    )
  }

  // Validate days
  const daysNum = Number(days)
  if (isNaN(daysNum) || daysNum < 1 || daysNum > 30) {
    console.error("[Make.com Webhook] ❌ Invalid days value")
    return NextResponse.json(
      { 
        error: "Validation error",
        message: "days must be a number between 1 and 30",
        received: { days: body.days }
      },
      { status: 400 }
    )
  }

  // Normalize dietaryRestrictions and foodPreferences to arrays
  let dietaryRestrictionsArray: string[] = []
  if (Array.isArray(dietaryRestrictions)) {
    dietaryRestrictionsArray = dietaryRestrictions.filter(r => typeof r === "string" && r.trim().length > 0)
  } else if (typeof dietaryRestrictions === "string" && dietaryRestrictions.trim()) {
    dietaryRestrictionsArray = dietaryRestrictions.split(",").map(r => r.trim()).filter(Boolean)
  }

  let foodPreferencesArray: string[] = []
  if (Array.isArray(foodPreferences)) {
    foodPreferencesArray = foodPreferences.filter(p => typeof p === "string" && p.trim().length > 0)
  } else if (typeof foodPreferences === "string" && foodPreferences.trim()) {
    foodPreferencesArray = [foodPreferences.trim()]
  }

  console.log("[Make.com Webhook] ✅ All required fields validated")
  console.log("[Make.com Webhook] Validated data:", {
    profileId,
    days: daysNum,
    caloriesTarget,
    proteinTargetG,
    fatTargetG,
    carbTargetG,
    workoutsPerWeek: Number(workoutsPerWeek),
    dietaryRestrictionsCount: dietaryRestrictionsArray.length,
    foodPreferencesCount: foodPreferencesArray.length,
  })

  // Step 6: Validate profile exists
  let profile
  try {
    profile = await prisma.profile.findUnique({
      where: { id: profileId.trim() },
      include: { user: true },
    })

    if (!profile) {
      console.error("[Make.com Webhook] ❌ Profile not found:", profileId)
      return NextResponse.json(
        { 
          error: "Profile not found",
          message: `No profile found with ID: ${profileId}`,
          hint: "Make sure the profileId sent from Make.com matches an existing profile in the database"
        },
        { status: 404 }
      )
    }

    console.log("[Make.com Webhook] ✅ Profile found:", { id: profile.id, name: profile.name, userId: profile.userId })
  } catch (profileError: any) {
    console.error("[Make.com Webhook] ❌ Error looking up profile:", profileError)
    console.error("[Make.com Webhook] Profile error details:", {
      message: profileError.message,
      code: profileError.code,
      meta: profileError.meta,
    })
    return NextResponse.json(
      { 
        error: "Database error",
        message: "Failed to look up profile",
        details: profileError.message || "Unknown database error"
      },
      { status: 500 }
    )
  }

  // Step 7: Generate plan
  let plan
  try {
    console.log("[Make.com Webhook] Starting plan generation...")
    plan = await generatePlan({
      profileId: profileId.trim(),
      days: daysNum,
      caloriesTarget: Number(caloriesTarget),
      proteinTargetG: Number(proteinTargetG),
      fatTargetG: Number(fatTargetG),
      carbTargetG: Number(carbTargetG),
      workoutsPerWeek: Number(workoutsPerWeek) || 4,
      dietaryRestrictions: dietaryRestrictionsArray,
      foodPreferences: foodPreferencesArray,
    })
    
    console.log("[Make.com Webhook] ✅ Plan generated successfully!")
    console.log("[Make.com Webhook] Plan ID:", plan.id)
    console.log("[Make.com Webhook] Plan has", plan.days?.length || 0, "days")
    
    // Verify plan was created correctly
    if (!plan.id) {
      throw new Error("Plan was created but has no ID")
    }
    
    if (!plan.days || plan.days.length === 0) {
      throw new Error("Plan was created but has no days")
    }
    
    const totalMeals = plan.days.reduce((sum: number, day: any) => sum + (day.meals?.length || 0), 0)
    console.log("[Make.com Webhook] Plan has", totalMeals, "total meals")
    
    if (totalMeals === 0) {
      throw new Error("Plan was created but has no meals")
    }

  } catch (genError: any) {
    console.error("[Make.com Webhook] ❌ Error generating plan:", genError)
    console.error("[Make.com Webhook] Generation error details:", {
      message: genError.message,
      stack: genError.stack,
      code: genError.code,
      meta: genError.meta,
    })
    
    return NextResponse.json(
      { 
        error: "Plan generation failed",
        message: genError.message || "Failed to generate plan",
        details: process.env.NODE_ENV === "development" ? genError.stack : undefined
      },
      { status: 500 }
    )
  }

  // Step 8: Return success response
  try {
    const totalMeals = plan.days?.reduce((sum: number, day: any) => sum + (day.meals?.length || 0), 0) || 0
    
    const response = {
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
        mealsCount: totalMeals,
      },
    }

    console.log("[Make.com Webhook] ✅ Returning success response")
    console.log("[Make.com Webhook] Response:", JSON.stringify(response, null, 2))
    
    return NextResponse.json(response, { status: 200 })
  } catch (responseError: any) {
    console.error("[Make.com Webhook] ❌ Error creating response:", responseError)
    // Even if response creation fails, we still have the plan, so return basic success
    return NextResponse.json(
      {
        success: true,
        planId: plan.id,
        message: "Plan generated successfully (response formatting had minor issues)",
      },
      { status: 200 }
    )
  } finally {
    // Disconnect Prisma (optional, but good practice)
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      // Ignore disconnect errors
      console.warn("[Make.com Webhook] Warning: Error disconnecting Prisma (non-critical):", disconnectError)
    }
  }
}
