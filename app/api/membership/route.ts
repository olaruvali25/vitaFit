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

    // Convert plan to uppercase for frontend
    const planUpper =
      membership.plan === "plus"
        ? "PLUS"
        : membership.plan === "family"
          ? "FAMILY"
          : membership.plan === "pro"
            ? "PRO"
            : membership.plan === "free trial"
              ? "FREE_TRIAL"
              : "NONE"

    return NextResponse.json({
      plan: planUpper,
      status: membership.status,
      canUseFeatures: membership.canUseFeatures,
      profilesLimit: membership.profilesLimit,
      plansPerProfileLimit: 0,
      canCreateMore: profileLimits.canCreate,
      currentProfileCount: profileLimits.currentCount,
      profileLimit: profileLimits.limit,
      // Trial-related fields
      hasUsedTrial: membership.hasUsedTrial,
      canStartTrial: membership.canStartTrial,
      trialEndsAt: membership.trialEndsAt,
      isTrialExpired: membership.isTrialExpired,
    })
  } catch (error) {
    console.error("Get membership error:", error)
    return NextResponse.json(
      { error: "Failed to fetch membership" },
      { status: 500 }
    )
  }
}

