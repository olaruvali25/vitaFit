import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { canCreatePlan } from "@/lib/membership"

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get("profileId")

    const where: any = {
      profile: {
        userId: (user as any).id,
      },
    }

    if (profileId) {
      where.profileId = profileId
    }

    const plans = await prisma.plan.findMany({
      where,
      include: {
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        days: {
          include: {
            meals: {
              orderBy: { mealOrder: "asc" },
            },
          },
          orderBy: { dayNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    console.log(`[API Plans GET] Found ${plans.length} plans for user`)
    plans.forEach((plan: any) => {
      console.log(`[API Plans GET] Plan ${plan.id}: ${plan.days?.length || 0} days, ${plan.days?.reduce((sum: number, day: any) => sum + (day.meals?.length || 0), 0) || 0} meals`)
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Get plans error:", error)
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    const userRole = (user as any).role

    const body = await request.json()
    const { profileId, title, startDate, endDate, source } = body

    if (!profileId || !title) {
      return NextResponse.json(
        { error: "Profile ID and title are required" },
        { status: 400 }
      )
    }

    // Verify profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Check if user can create more plans
    const { canCreate, currentCount, limit } = await canCreatePlan(
      userId,
      profileId,
      userRole
    )

    if (!canCreate) {
      return NextResponse.json(
        {
          error: `You've reached your plan limit for this profile (${currentCount}/${limit}). Upgrade your plan to create more plans.`,
        },
        { status: 403 }
      )
    }

    const plan = await prisma.plan.create({
      data: {
        profileId,
        title,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        source: source || "manual",
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error("Create plan error:", error)
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    )
  }
}

