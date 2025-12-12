import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk } from "@/lib/api-response"
import { signJwt, getJwtSecret } from "@/lib/jwt"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Ensure JWT secret exists (throws if missing)
    getJwtSecret()
  } catch (err: any) {
    return jsonError("CONFIG_MISSING", err.message ?? "JWT secret missing.", 500)
  }

  const body = await req.json().catch(() => null)
  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("INVALID_INPUT", "Invalid signup payload.", 400)
  }
  const { email, password, name } = parsed.data
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    return jsonError("EMAIL_IN_USE", "This email is already registered.", 400)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: normalizedEmail,
        name: name ?? null,
        passwordHash,
        subscriptionTier: SubscriptionTier.free_trial,
        subscriptionStatus: SubscriptionStatus.active,
        tokenVersion: 0,
      },
    })

    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        name: name ?? "Primary Profile",
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
        goalWeight: 0,
        startWeight: 0,
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
    

    return { user, profile }
  })

  const token = signJwt({
    userId: result.user.id,
    activeProfileId: result.profile.id,
    tokenVersion: result.user.tokenVersion,
  })

  return jsonOk({
    token,
    user: {
      id: result.user.id,
      email: result.user.email,
      subscriptionTier: result.user.subscriptionTier,
      subscriptionStatus: result.user.subscriptionStatus,
    },
    activeProfileId: result.profile.id,
  })
}

