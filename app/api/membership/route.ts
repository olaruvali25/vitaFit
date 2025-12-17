import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { getUserMembership, canCreateProfile } from "@/lib/membership"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id
    const userRole = (user as any).role || "USER"

    const membership = await getUserMembership(userId)
    const profileLimits = await canCreateProfile(userId, userRole)

    const planUpper =
      membership.plan === "plus"
        ? "PLUS"
        : membership.plan === "family"
          ? "FAMILY"
          : membership.plan === "pro"
            ? "PRO"
            : "FREE_TRIAL"

    return NextResponse.json({
      plan: planUpper,
      status: membership.status,
      canUseFeatures: true,
      profilesLimit: membership.profilesLimit,
      plansPerProfileLimit: 0,
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

