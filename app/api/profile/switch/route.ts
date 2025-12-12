import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/authz"
import { jsonError, jsonOk } from "@/lib/api-response"
import { signJwt } from "@/lib/jwt"
import { PROFILE_LIMITS } from "@/lib/subscription"

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth
  const body = await req.json().catch(() => null)
  const profileId = body?.profileId as string | undefined
  if (!profileId) {
    return jsonError("INVALID_INPUT", "profileId is required.", 400)
  }

  const profile = user.profiles.find((p) => p.id === profileId)
  if (!profile) {
    return jsonError("NOT_FOUND", "Profile not found.", 404)
  }

  const limit = PROFILE_LIMITS[user.subscriptionTier]
  const sortedProfiles = [...user.profiles].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  const primaryProfileId = sortedProfiles[0]?.id

  if (limit === 1 && profile.id !== primaryProfileId) {
    return jsonError("PROFILE_ACCESS_BLOCKED", "Please upgrade your plan to access this profile.", 403)
  }

  const token = signJwt({
    userId: user.id,
    activeProfileId: profile.id,
    tokenVersion: user.tokenVersion,
  })

  return jsonOk({
    token,
    activeProfileId: profile.id,
  })
}

