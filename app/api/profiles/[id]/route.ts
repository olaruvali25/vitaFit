import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const profile = await prisma.profile.findFirst({
      where: {
        id,
        userId: (user as any).id,
      },
      include: {
        plans: {
          orderBy: { createdAt: "desc" },
        },
        progressEntries: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    })

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

    // Verify profile belongs to user
    const existingProfile = await prisma.profile.findFirst({
      where: {
        id,
        userId: (user as any).id,
      },
    })

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: {
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
      },
    })

    return NextResponse.json(profile)
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

    // Verify profile belongs to user
    const existingProfile = await prisma.profile.findFirst({
      where: {
        id,
        userId: (user as any).id,
      },
    })

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    await prisma.profile.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Delete profile error:", error)
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    )
  }
}

