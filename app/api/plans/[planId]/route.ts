import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
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
    const { planId } = await params

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
        days: {
          include: {
            meals: {
              orderBy: { mealOrder: "asc" },
            },
            progress: true,
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Verify the plan belongs to the user
    if (plan.profile.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Get plan error:", error)
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 })
  }
}

