import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { initializeFreeTrial, hasUserUsedFreeTrial } from "@/lib/membership"

export async function POST(request: NextRequest) {
  try {
    let user
    try {
      user = await requireAuth()
    } catch (error: any) {
      if (error.statusCode === 401) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }
      throw error
    }
    const userId = (user as any).id

    // Server-side validation: Check if trial was already used
    const alreadyUsed = await hasUserUsedFreeTrial(userId)
    if (alreadyUsed) {
      return NextResponse.json(
        { 
          success: false,
          error: "You've already used your free trial. Please upgrade to continue.",
          alreadyUsed: true
        },
        { status: 403 }
      )
    }

    // Initialize free trial with full validation
    const result = await initializeFreeTrial(userId)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || "Failed to activate free trial"
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Free trial activated successfully",
    })
  } catch (error: any) {
    console.error("Activate trial error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to activate free trial" },
      { status: 500 }
    )
  }
}

