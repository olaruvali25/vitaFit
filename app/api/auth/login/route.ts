import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk } from "@/lib/api-response"
import { getJwtSecret, signJwt } from "@/lib/jwt"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    getJwtSecret()
  } catch (err: any) {
    return jsonError("CONFIG_MISSING", err.message ?? "JWT secret missing.", 500)
  }

  const body = await req.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("INVALID_INPUT", "Invalid login payload.", 400)
  }
  const { email, password } = parsed.data
  const normalizedEmail = email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profiles: { orderBy: { createdAt: "asc" } } },
  })
  if (!user || !user.passwordHash) {
    return jsonError("INVALID_CREDENTIALS", "Invalid email or password.", 401)
  }

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    return jsonError("INVALID_CREDENTIALS", "Invalid email or password.", 401)
  }

  let activeProfileId = user.profiles[0]?.id
  if (!activeProfileId) {
    // create a default profile + tracker if missing
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        name: "Primary Profile",
      },
    })
    const tracker = await prisma.tracker.create({
      data: {
        profileId: profile.id,
        dailyProgress: {},
        weeklyOverview: {},
        caloriesHistory: [],
        workoutHistory: [],
        hydrationHistory: [],
        currentPlan: {},
        goalWeight: 0,
        startWeight: 0,
      },
    })
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        tracker: {
          connect: { id: tracker.id },
        },
      },
    })
    
    activeProfileId = profile.id
  }

  const token = signJwt({
    userId: user.id,
    activeProfileId,
    tokenVersion: user.tokenVersion,
  })

  return jsonOk({
    token,
    user: {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
    },
    activeProfileId,
  })
}

