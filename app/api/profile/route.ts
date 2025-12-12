import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk } from "@/lib/api-response"
import { getAuthContext } from "@/lib/authz"
import { PROFILE_LIMITS } from "@/lib/subscription"
import { z } from "zod"
import { SubscriptionTier } from "@prisma/client"

const createSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().optional(),
  gender: z.string().optional(),
  goal: z.string().optional(),
  goalWeight: z.number().optional(),
  startWeight: z.number().optional(),
})

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth

  return jsonOk({
    profiles: user.profiles.map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
    })),
  })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("INVALID_INPUT", "Invalid profile payload.", 400)
  }
  const data = parsed.data

  const limit = PROFILE_LIMITS[user.subscriptionTier]
  const count = await prisma.profile.count({ where: { userId: user.id } })
  if (count >= limit) {
    return jsonError("PROFILE_LIMIT_REACHED", "Maximum number of profiles reached.", 400)
  }

  const result = await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        goal: data.goal,
      },
    })

    const tracker = await tx.tracker.create({
      data: {
        profileId: profile.id,
        dailyProgress: {},
        weeklyOverview: {},
        caloriesHistory: [],
        workoutHistory: [],
        hydrationHistory: [],
        currentPlan: {},
        goalWeight: data.goalWeight ?? 0,
        startWeight: data.startWeight ?? 0,
      },
    })

    await tx.profile.update({
      where: { id: profile.id },
      data: {
        tracker: {
          connect: { id: tracker.id },
        },
      },
    })
    

    return { profile, tracker }
  })

  return jsonOk({
    profile: {
      id: result.profile.id,
      name: result.profile.name,
    },
  })
}

