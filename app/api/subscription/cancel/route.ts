import { NextRequest } from "next/server"
import { jsonError, jsonOk } from "@/lib/api-response"
import { getAuthContext } from "@/lib/authz"
import { SubscriptionStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionStatus: SubscriptionStatus.canceled },
  })

  return jsonOk({
    message: "Subscription canceled. Access remains until period end.",
    subscriptionStatus: updated.subscriptionStatus,
  })
}

