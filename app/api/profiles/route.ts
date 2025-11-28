import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { canCreateProfile } from "@/lib/membership"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const profiles = await prisma.profile.findMany({
      where: { userId: (user as any).id },
      orderBy: { createdAt: "desc" },
      include: {
        plans: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { plans: true },
        },
      },
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("Get profiles error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id
    const userRole = (user as any).role

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
    const { name, age, gender, heightCm, weightKg, goal, goalWeight } = body

    if (!name) {
      return NextResponse.json(
        { error: "Profile name is required" },
        { status: 400 }
      )
    }

    // Default profile picture URL - can be customized later
    const defaultProfilePicture = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name

    const profile = await prisma.profile.create({
      data: {
        userId,
        name,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        goal: goal || null,
        goalWeight: goalWeight ? parseFloat(goalWeight) : null,
        profilePicture: defaultProfilePicture,
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("Create profile error:", error)
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
}

