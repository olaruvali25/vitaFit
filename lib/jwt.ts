import jwt from "jsonwebtoken"
import { jsonError } from "./api-response"

export type JwtPayload = {
  userId: string
  activeProfileId?: string | null
  tokenVersion: number
  iat?: number
  exp?: number
}

export function getJwtSecret(): string {
  const secret =
    process.env.JWT_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "fallback-secret-for-development-only-change-in-production"
  return secret
}

export function signJwt(payload: Omit<JwtPayload, "iat" | "exp">) {
  const secret = getJwtSecret()
  return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn: "7d" })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret) as JwtPayload
  } catch {
    return null
  }
}

export function requireJwt(token?: string) {
  if (!token) {
    return { error: jsonError("UNAUTHORIZED", "Missing authorization token.", 401) }
  }
  const payload = verifyJwt(token)
  if (!payload) {
    return { error: jsonError("UNAUTHORIZED", "Invalid or expired token.", 401) }
  }
  return { payload }
}

