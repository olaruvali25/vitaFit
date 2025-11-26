import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { initializeFreeTrial } from "@/lib/membership"

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

    // Initialize free trial
    await initializeFreeTrial(userId)

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

