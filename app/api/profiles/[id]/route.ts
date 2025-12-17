import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { deleteProfileForUser, getProfileForUser, updateProfileForUser } from "@/lib/profile-store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const profile = getProfileForUser((user as any).id, id)

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
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

    const updated = updateProfileForUser((user as any).id, id, {
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
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
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

    const ok = deleteProfileForUser((user as any).id, id)
    if (!ok) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Delete profile error:", error)
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    )
  }
}

