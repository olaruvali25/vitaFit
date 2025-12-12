import { NextRequest } from "next/server"
import { jsonError, jsonOk } from "@/lib/api-response"
import { getAuthContext } from "@/lib/authz"
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client"
import { isUpgradeAllowed } from "@/lib/subscription"
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
    return jsonError("INVALID_INPUT", "Invalid subscription upgrade payload.", 400)
  }
  const { targetTier } = parsed.data

  if (!isUpgradeAllowed(user.subscriptionTier, targetTier)) {
    return jsonError("INVALID_SUBSCRIPTION_CHANGE", "Upgrade path not allowed.", 400)
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: targetTier,
      subscriptionStatus: SubscriptionStatus.active,
    },
  })

  return jsonOk({
    message: "Subscription upgraded. +1 bonus month applied.",
    subscriptionTier: updated.subscriptionTier,
    subscriptionStatus: updated.subscriptionStatus,
  })
}

