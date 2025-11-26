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
    
    // Verify profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: {
        id,
        userId: (user as any).id,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")

    const progressEntries = await prisma.progressEntry.findMany({
      where: { profileId: id },
      orderBy: { date: "desc" },
      take: limit,
    })

    return NextResponse.json(progressEntries)
  } catch (error) {
    console.error("Get progress error:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    
    // Verify profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: {
        id,
        userId: (user as any).id,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { date, weightKg, workoutsCompleted, mealsCompleted, notes } = body

    // Use provided date or today
    const entryDate = date ? new Date(date) : new Date()
    
    // Check if entry already exists for this date
    const existing = await prisma.progressEntry.findUnique({
      where: {
        profileId_date: {
          profileId: id,
          date: entryDate,
        },
      },
    })

    let entry
    if (existing) {
      // Update existing entry
      entry = await prisma.progressEntry.update({
        where: { id: existing.id },
        data: {
          weightKg: weightKg ? parseFloat(weightKg) : null,
          workoutsCompleted: workoutsCompleted ? parseInt(workoutsCompleted) : 0,
          mealsCompleted: mealsCompleted ? parseInt(mealsCompleted) : 0,
          notes: notes || null,
        },
      })
    } else {
      // Create new entry
      entry = await prisma.progressEntry.create({
        data: {
          profileId: id,
          date: entryDate,
          weightKg: weightKg ? parseFloat(weightKg) : null,
          workoutsCompleted: workoutsCompleted ? parseInt(workoutsCompleted) : 0,
          mealsCompleted: mealsCompleted ? parseInt(mealsCompleted) : 0,
          notes: notes || null,
        },
      })
    }

    return NextResponse.json(entry, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error("Create progress error:", error)
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    )
  }
}

