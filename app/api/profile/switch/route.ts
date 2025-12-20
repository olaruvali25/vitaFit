import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { listProfilesForUser } from "@/lib/profile-store"
import { getUserMembership } from "@/lib/membership"
import { PROFILE_LIMITS as MEMBERSHIP_PROFILE_LIMITS } from "@/lib/membership"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json().catch(() => null)
    const profileId = body?.profileId as string | undefined
    
    if (!profileId) {
      return NextResponse.json(
        { error: "profileId is required" },
        { status: 400 }
      )
    }

    // Get user's profiles
    const profiles = await listProfilesForUser(user.id)
    const profile = profiles.find(p => p.id === profileId)
    
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Get membership to check limits
    const membership = await getUserMembership(user.id)
    const limit = MEMBERSHIP_PROFILE_LIMITS[membership.plan] || 1
    
    // Sort profiles by creation date
    const sortedProfiles = [...profiles].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    const primaryProfileId = sortedProfiles[0]?.id

    // Check if user can access this profile based on plan
    if (limit === 1 && profile.id !== primaryProfileId) {
      return NextResponse.json(
        { error: "Please upgrade your plan to access this profile." },
        { status: 403 }
      )
    }

    return NextResponse.json({
      activeProfileId: profile.id,
    })
  } catch (error: any) {
    console.error("Switch profile error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to switch profile" },
      { status: error.statusCode || 500 }
    )
  }
}
