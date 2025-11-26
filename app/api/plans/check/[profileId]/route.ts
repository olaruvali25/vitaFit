import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
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
    const { profileId } = await params

    // Verify profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get latest plan for this profile
    const latestPlan = await prisma.plan.findFirst({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      include: {
        days: {
          include: {
            meals: {
              take: 1, // Just check if meals exist
            },
          },
        },
      },
    })

    return NextResponse.json({
      hasPlan: !!latestPlan,
      planId: latestPlan?.id || null,
      planReady: latestPlan && latestPlan.days.length > 0 && latestPlan.days[0].meals.length > 0,
    })
  } catch (error) {
    console.error("Check plan error:", error)
    return NextResponse.json({ error: "Failed to check plan" }, { status: 500 })
  }
}

