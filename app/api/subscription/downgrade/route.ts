import { NextRequest } from "next/server"
import { jsonError, jsonOk } from "@/lib/api-response"
import { getAuthContext } from "@/lib/authz"
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client"
import { isDowngradeAllowed, PROFILE_LIMITS } from "@/lib/subscription"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  targetTier: z.nativeEnum(SubscriptionTier),
})

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return jsonError("INVALID_INPUT", "Invalid subscription downgrade payload.", 400)
  }
  const { targetTier } = parsed.data

  if (!isDowngradeAllowed(user.subscriptionTier, targetTier)) {
    return jsonError("INVALID_SUBSCRIPTION_CHANGE", "Downgrade path not allowed.", 400)
  }

  const profileCount = await prisma.profile.count({ where: { userId: user.id } })
  const targetLimit = PROFILE_LIMITS[targetTier]

  if (profileCount > targetLimit) {
    return jsonError(
      "PROFILE_LIMIT_REACHED_AFTER_DOWNGRADE",
      `Reduce profiles to ${targetLimit} before downgrading to ${targetTier.toLowerCase()}.`,
      400
    )
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: targetTier,
      subscriptionStatus: SubscriptionStatus.active,
    },
  })

  return jsonOk({
    message: "Subscription downgraded.",
    subscriptionTier: updated.subscriptionTier,
    subscriptionStatus: updated.subscriptionStatus,
  })
}

