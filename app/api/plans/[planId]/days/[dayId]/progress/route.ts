import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string }> }
) {
  try {
    await requireAuth()
    const { dayId } = await params

    const progress = await prisma.planDayProgress.findUnique({
      where: { planDayId: dayId },
      include: {
        planDay: {
          include: {
            plan: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    })

    if (!progress) {
      return NextResponse.json({ error: "Progress not found" }, { status: 404 })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Get progress error:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string }> }
) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id
    const { dayId } = await params
    const body = await request.json()

    const { waterGlassesDrunk, workoutCompleted } = body

    // Verify the plan belongs to the user
    const planDay = await prisma.planDay.findUnique({
      where: { id: dayId },
      include: {
        plan: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!planDay) {
      return NextResponse.json({ error: "Plan day not found" }, { status: 404 })
    }

    if (planDay.plan.profile.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const progress = await prisma.planDayProgress.update({
      where: { planDayId: dayId },
      data: {
        ...(waterGlassesDrunk !== undefined && { waterGlassesDrunk }),
        ...(workoutCompleted !== undefined && { workoutCompleted }),
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}

