import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/authz"
import { jsonError, jsonOk } from "@/lib/api-response"
import { prisma } from "@/lib/prisma"
import { canAccessTracker } from "@/lib/subscription"
import { z } from "zod"

const updateSchema = z.object({
  dailyProgress: z.any().optional(),
  weeklyOverview: z.any().optional(),
  caloriesHistory: z.array(z.number()).optional(),
  workoutHistory: z.array(z.any()).optional(),
  hydrationHistory: z.array(z.number()).optional(),
  currentPlan: z.any().optional(),
  goalWeight: z.number().optional(),
  startWeight: z.number().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth
  const { profileId } = await params

  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.id },
    include: { tracker: true },
  })
  if (!profile) {
    return jsonError("NOT_FOUND", "Profile not found.", 404)
  }
  if (!profile.tracker) {
    return jsonError("TRACKER_MISSING", "Tracker not found for this profile.", 404)
  }
  if (!canAccessTracker(user.subscriptionTier)) {
    return jsonError("TRACKER_LOCKED", "Tracker access is locked for your current plan.", 403)
  }

  return jsonOk({ tracker: profile.tracker })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth

  const { profileId } = await params
  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.id },
    include: { tracker: true },
  })
  if (!profile || !profile.tracker) {
    return jsonError("NOT_FOUND", "Profile not found.", 404)
  }
  if (!canAccessTracker(user.subscriptionTier)) {
    return jsonError("TRACKER_LOCKED", "Tracker access is locked for your current plan.", 403)
  }

  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("INVALID_INPUT", "Invalid tracker update payload.", 400)
  }

  const tracker = await prisma.tracker.update({
    where: { id: profile.tracker.id, profileId },
    data: {
      ...parsed.data,
    },
  })

  return jsonOk({ tracker })
}

