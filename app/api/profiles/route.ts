import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { canCreateProfile } from "@/lib/membership"
import { createProfileForUser, listProfilesForUser } from "@/lib/profile-store"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const profiles = await listProfilesForUser(user.id)
    return NextResponse.json(profiles)
  } catch (error: any) {
    console.error("Get profiles error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch profiles" },
      { status: error.statusCode || 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const userId = user.id
    const userRole = (user as any).user_metadata?.role || 'USER'

    // Check if user can create more profiles
    const { canCreate, currentCount, limit } = await canCreateProfile(
      userId,
      userRole
    )

    if (!canCreate) {
      return NextResponse.json(
        {
          error: `You've reached your profile limit (${currentCount}/${limit}). Upgrade your plan to create more profiles.`,
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: "Profile name is required" },
        { status: 400 }
      )
    }

    const created = await createProfileForUser(userId, String(name).trim())
    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error("Create profile error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create profile" },
      { status: error.statusCode || 500 }
    )
  }
}
