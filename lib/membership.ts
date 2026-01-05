import { supabaseAdmin } from "./supabase"
import { countProfilesForUser } from "./profile-store"

type PlanKey = "free trial" | "pro" | "plus" | "family" | "none"

// Membership status types
export type MembershipStatus = "NONE" | "TRIAL" | "EXPIRED_TRIAL" | "ACTIVE" | "INACTIVE"

// Profile limits (TOTAL profiles)
// - No plan / Free / Trial: 1
// - Pro: 1
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
  status: MembershipStatus
  profilesLimit: number
  canUseFeatures: boolean
  hasUsedTrial: boolean
  trialEndsAt: string | null
  isTrialExpired: boolean
  canStartTrial: boolean
}

/**
 * Check if a trial has expired based on trial_ends_at date
 */
function isTrialExpired(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false
  return new Date(trialEndsAt) < new Date()
}

/**
 * Get comprehensive membership info for a user
 */
export async function getUserMembership(userId: string): Promise<MembershipInfo> {
  let plan: PlanKey = "none"
  let hasUsedTrial = false
  let trialEndsAt: string | null = null
  let subscriptionStatus: string | null = null

  if (supabaseAdmin) {
    // Get user's account profile
    const { data: accountProfile } = await supabaseAdmin
      .from("profiles")
      .select("plan, has_used_free_trial")
      .eq("id", userId)
      .maybeSingle()

    const raw = (accountProfile?.plan as string | null) || null
    if (raw === "free trial" || raw === "pro" || raw === "plus" || raw === "family") {
      plan = raw
    }
    
    // Check if user has ever used free trial
    hasUsedTrial = accountProfile?.has_used_free_trial === true

    // Get subscription details for trial dates
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, trial_ends_at, trial_started_at")
      .eq("user_id", userId)
      .maybeSingle()

    if (subscription) {
      trialEndsAt = subscription.trial_ends_at || null
      subscriptionStatus = subscription.status || null
      
      // If user has/had a free trial subscription, mark as used
      if (subscription.plan === "free trial" || subscription.trial_started_at) {
        hasUsedTrial = true
      }
    }
  }

  // Determine trial expiration
  const trialExpired = plan === "free trial" && isTrialExpired(trialEndsAt)

  // Determine membership status
  let status: MembershipStatus
  if (plan === "pro" || plan === "plus" || plan === "family") {
    // Paid plans
    if (subscriptionStatus === "canceled" || subscriptionStatus === "past_due" || subscriptionStatus === "expired") {
      status = "INACTIVE"
    } else {
      status = "ACTIVE"
    }
  } else if (plan === "free trial") {
    if (trialExpired) {
      status = "EXPIRED_TRIAL"
    } else {
      status = "TRIAL"
    }
  } else {
    // No plan
    status = "NONE"
  }

  // Can use features if on active trial or active paid plan
  const canUseFeatures = status === "ACTIVE" || status === "TRIAL"
  
  // Can start trial only if never used before
  const canStartTrial = !hasUsedTrial

  return {
    plan,
    status,
    profilesLimit: PROFILE_LIMITS[plan],
    canUseFeatures,
    hasUsedTrial,
    trialEndsAt,
    isTrialExpired: trialExpired,
    canStartTrial,
  }
}

/**
 * Check if user has already used their free trial
 */
export async function hasUserUsedFreeTrial(userId: string): Promise<boolean> {
  if (!supabaseAdmin) return false

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("has_used_free_trial")
    .eq("id", userId)
    .maybeSingle()

  if (profile?.has_used_free_trial === true) {
    return true
  }

  // Also check subscriptions table for any free trial history
  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("id, trial_started_at")
    .eq("user_id", userId)
    .not("trial_started_at", "is", null)
    .limit(1)

  return !!subscription && subscription.length > 0
}

/**
 * Initialize free trial for user - with server-side validation
 * Returns error message if trial cannot be started
 */
export async function initializeFreeTrial(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: "Database not configured" }
  }

  // Check if user has already used free trial
  const alreadyUsed = await hasUserUsedFreeTrial(userId)
  if (alreadyUsed) {
    return { 
      success: false, 
      error: "You've already used your free trial. Please upgrade to continue." 
    }
  }

  const now = new Date()
  const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from now

  // Update user profile with trial plan and mark trial as used
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "free trial",
      has_used_free_trial: true,
    })
    .eq("id", userId)

  if (profileError) {
    console.error("Failed to update profile for trial:", profileError)
    return { success: false, error: "Failed to activate trial" }
  }

  // Create or update subscription record
  const { error: subError } = await supabaseAdmin
    .from("subscriptions")
    .upsert({
      user_id: userId,
      plan: "free trial",
      status: "active",
      trial_started_at: now.toISOString(),
      trial_ends_at: trialEnd.toISOString(),
    }, { onConflict: "user_id" })

  if (subError) {
    console.error("Failed to create subscription for trial:", subError)
    return { success: false, error: "Failed to activate trial" }
  }

  return { success: true }
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
export async function canUseAppFeatures(userId: string): Promise<boolean> {
  const membership = await getUserMembership(userId)
  return membership.canUseFeatures
}

/**
 * Get profile count for user
 */
export async function getUserProfileCount(userId: string, userRole: string): Promise<number> {
  return await countProfilesForUser(userId)
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
    const currentCount = await countProfilesForUser(userId)
    return { canCreate: true, currentCount, limit: Infinity }
  }

  const limit = await getMaxProfilesForUser(userId, userRole)
  const currentCount = await countProfilesForUser(userId)

  // CRITICAL: First profile is ALWAYS allowed regardless of plan
  if (currentCount === 0) {
    return { canCreate: true, currentCount: 0, limit }
  }

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
  return { canCreate: true, currentCount: 0, limit: Infinity }
}
