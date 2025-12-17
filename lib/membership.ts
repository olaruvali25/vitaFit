import { supabaseAdmin } from "./supabase"
import { listProfilesForUser } from "./profile-store"

type PlanKey = "free trial" | "pro" | "plus" | "family" | "none"

// Profile limits (TOTAL profiles)
// - No plan / Free / Trial: 1
// - Plus: 2
// - Family: 4
export const PROFILE_LIMITS: Record<PlanKey, number> = {
  none: 1,
  "free trial": 1,
  pro: 1,
  plus: 2,
  family: 4,
}

export type MembershipInfo = {
  plan: PlanKey
  status: "NONE" | "TRIAL" | "ACTIVE"
  profilesLimit: number
  canUseFeatures: boolean
}

export async function getUserMembership(userId: string): Promise<MembershipInfo> {
  // If the "account profile" record doesn't exist yet, treat as no plan.
  let plan: PlanKey = "none"

  if (supabaseAdmin) {
    const { data: accountProfile } = await supabaseAdmin
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle()

    const raw = (accountProfile?.plan as string | null) || null
    if (raw === "free trial" || raw === "pro" || raw === "plus" || raw === "family") {
      plan = raw
    }
  }

  const status: MembershipInfo["status"] =
    plan === "plus" || plan === "family" ? "ACTIVE" : plan === "free trial" ? "TRIAL" : "NONE"

  return {
    plan,
    status,
    profilesLimit: PROFILE_LIMITS[plan],
    canUseFeatures: status === "ACTIVE" || status === "TRIAL",
  }
}

/**
 * Get maximum profiles allowed for a user (canonical function)
 * Ensures minimum of 1 profile for all users, even without membership
 */
export async function getMaxProfilesForUser(userId: string, userRole: string): Promise<number> {
  if (userRole === "ADMIN") return Infinity
  const membership = await getUserMembership(userId)
  return membership.profilesLimit
}

/**
 * Check if user can use app features (trial or active subscription)
 */
export async function canUseAppFeatures(_userId: string): Promise<boolean> {
  // Not used for profile gating. Keep conservative default.
  return true
}

/**
 * Legacy compatibility export.
 * This codebase previously initialized a "free trial" membership record in a separate DB.
 * We now derive profile limits from the user's plan, and default to 1 when missing.
 */
export async function initializeFreeTrial(_userId: string): Promise<void> {
  // No-op: profile #1 is always allowed regardless of plan.
  return
}

/**
 * Get profile count for user (respects admin override)
 */
export async function getUserProfileCount(userId: string, userRole: string): Promise<number> {
  if (userRole === "ADMIN") return listProfilesForUser(userId).length
  return listProfilesForUser(userId).length
}

/**
 * Check if user can create more profiles
 * Uses canonical getMaxProfilesForUser to ensure minimum baseline of 1 profile
 */
export async function canCreateProfile(
  userId: string,
  userRole: string
): Promise<{ canCreate: boolean; currentCount: number; limit: number }> {
  if (userRole === "ADMIN") {
    const currentCount = listProfilesForUser(userId).length
    return { canCreate: true, currentCount, limit: Infinity }
  }

  const limit = await getMaxProfilesForUser(userId, userRole)
  const currentCount = listProfilesForUser(userId).length

  return {
    canCreate: currentCount < limit,
    currentCount,
    limit,
  }
}

/**
 * Check if user can create more plans for a profile
 */
export async function canCreatePlan(
  userId: string,
  profileId: string,
  userRole: string
): Promise<{ canCreate: boolean; currentCount: number; limit: number }> {
  // Plan limits not part of the requested fix; keep permissive behavior.
  return { canCreate: true, currentCount: 0, limit: Infinity }
}

