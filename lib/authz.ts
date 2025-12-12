import { NextRequest } from "next/server"
import { prisma } from "./prisma"
import { requireJwt, getJwtSecret } from "./jwt"
import { jsonError } from "./api-response"

export async function getAuthContext(req: NextRequest) {
  try {
    // Ensure secret exists
    getJwtSecret()
  } catch (err: any) {
    return { error: jsonError("CONFIG_MISSING", err.message ?? "JWT secret missing.", 500) }
  }
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined
  const { payload, error } = requireJwt(token)
  if (error || !payload) {
    return { error }
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      profiles: {
        orderBy: { createdAt: "asc" },
      },
    },
  })
  if (!user) {
    return { error: jsonError("UNAUTHORIZED", "User not found.", 401) }
  }
  if (user.tokenVersion !== payload.tokenVersion) {
    return { error: jsonError("UNAUTHORIZED", "Token expired. Please login again.", 401) }
  }
  return { user, payload }
}

