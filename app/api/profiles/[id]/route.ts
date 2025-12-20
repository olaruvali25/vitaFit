import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { deleteProfileForUser, getProfileForUser, updateProfileForUser, countProfilesForUser } from "@/lib/profile-store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const profile = await getProfileForUser(user.id, id)

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: error.statusCode || 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()

    const updated = await updateProfileForUser(user.id, id, {
      name: body.name,
      age: body.age ? parseInt(body.age) : null,
      gender: body.gender || null,
      heightCm: body.heightCm ? parseFloat(body.heightCm) : null,
      weightKg: body.weightKg ? parseFloat(body.weightKg) : null,
      goal: body.goal || null,
      goalWeight: body.goalWeight ? parseFloat(body.goalWeight) : null,
      activityLevel: body.activityLevel || null,
      timeline: body.timeline || null,
      dietaryRestrictions: body.dietaryRestrictions || null,
      workoutDays: body.workoutDays || null,
      workoutDuration: body.workoutDuration || null,
      mealPrepDuration: body.mealPrepDuration || null,
    })

    if (!updated) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: error.statusCode || 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Check if this is the last profile
    const profileCount = await countProfilesForUser(user.id)
    if (profileCount <= 1) {
      return NextResponse.json(
        { error: "You must keep at least one profile" },
        { status: 400 }
      )
    }

    const ok = await deleteProfileForUser(user.id, id)
    if (!ok) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error: any) {
    console.error("Delete profile error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete profile" },
      { status: error.statusCode || 500 }
    )
  }
}
