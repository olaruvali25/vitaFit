import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { getUserMembership, canCreateProfile } from "@/lib/membership"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id
    const userRole = (user as any).role

    const membership = await getUserMembership(userId)
    const profileLimits = await canCreateProfile(userId, userRole)

    if (!membership) {
      return NextResponse.json({
        plan: "FREE_TRIAL",
        status: "INACTIVE",
        canUseFeatures: false,
        profilesLimit: 1,
        plansPerProfileLimit: 3,
        canCreateMore: true,
        currentProfileCount: 0,
        profileLimit: 1,
      })
    }

    return NextResponse.json({
      ...membership,
      canCreateMore: profileLimits.canCreate,
      currentProfileCount: profileLimits.currentCount,
      profileLimit: profileLimits.limit,
    })
  } catch (error) {
    console.error("Get membership error:", error)
    return NextResponse.json(
      { error: "Failed to fetch membership" },
      { status: 500 }
    )
  }
}

