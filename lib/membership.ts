import { prisma } from "./prisma"
import { MembershipPlan, MembershipStatus, UserRole } from "@prisma/client"

// Membership plan limits
export const MEMBERSHIP_LIMITS = {
  BASIC: { profiles: 1, plansPerProfile: 3 },
  PLUS: { profiles: 2, plansPerProfile: 5 },
  FAMILY: { profiles: 4, plansPerProfile: 10 },
} as const

// Free trial duration in days
export const TRIAL_DURATION_DAYS = 7

export interface MembershipInfo {
  plan: MembershipPlan
  status: MembershipStatus
  trialEndsAt: Date | null
  currentPeriodEnd: Date | null
  canUseFeatures: boolean
  profilesLimit: number
  plansPerProfileLimit: number
}

/**
 * Get user's membership information
 */
export async function getUserMembership(userId: string): Promise<MembershipInfo | null> {
  const membership = await prisma.membership.findUnique({
    where: { userId },
  })

  if (!membership) {
    return null
  }

  const limits = MEMBERSHIP_LIMITS[membership.plan]
  const canUseFeatures = membership.status === "TRIAL" || membership.status === "ACTIVE"
  
  // Check if trial is still valid
  const isTrialValid = membership.trialEndsAt 
    ? new Date() < membership.trialEndsAt 
    : false

  const finalCanUse = membership.status === "ACTIVE" || 
    (membership.status === "TRIAL" && isTrialValid)

  return {
    plan: membership.plan,
    status: membership.status,
    trialEndsAt: membership.trialEndsAt,
    currentPeriodEnd: membership.currentPeriodEnd,
    canUseFeatures: finalCanUse,
    profilesLimit: limits.profiles,
    plansPerProfileLimit: limits.plansPerProfile,
  }
}

/**
 * Check if user can use app features (trial or active subscription)
 */
export async function canUseAppFeatures(userId: string): Promise<boolean> {
  const membership = await getUserMembership(userId)
  if (!membership) return false
  return membership.canUseFeatures
}

/**
 * Initialize free trial for a new user
 */
export async function initializeFreeTrial(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { membership: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user already has a membership
  if (user.membership) {
    return
  }

  // Check if user has already used free trial
  if (user.hasUsedFreeTrial) {
    // Create inactive membership
    await prisma.membership.create({
      data: {
        userId,
        plan: "BASIC",
        status: "INACTIVE",
      },
    })
    return
  }

  // Create free trial membership
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS)

  await prisma.membership.create({
    data: {
      userId,
      plan: "BASIC",
      status: "TRIAL",
      trialStartedAt: new Date(),
      trialEndsAt,
    },
  })

  // Mark user as having used free trial
  await prisma.user.update({
    where: { id: userId },
    data: { hasUsedFreeTrial: true },
  })
}

/**
 * Get profile count for user (respects admin override)
 */
export async function getUserProfileCount(userId: string, userRole: UserRole): Promise<number> {
  if (userRole === "ADMIN") {
    // Admin can have unlimited profiles
    return await prisma.profile.count({ where: { userId } })
  }

  const membership = await getUserMembership(userId)
  if (!membership) return 0

  return await prisma.profile.count({ where: { userId } })
}

/**
 * Check if user can create more profiles
 */
export async function canCreateProfile(
  userId: string,
  userRole: UserRole
): Promise<{ canCreate: boolean; currentCount: number; limit: number }> {
  if (userRole === "ADMIN") {
    const count = await prisma.profile.count({ where: { userId } })
    return { canCreate: true, currentCount: count, limit: Infinity }
  }

  const membership = await getUserMembership(userId)
  if (!membership) {
    return { canCreate: false, currentCount: 0, limit: 0 }
  }

  const currentCount = await prisma.profile.count({ where: { userId } })
  const limit = membership.profilesLimit

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
  userRole: UserRole
): Promise<{ canCreate: boolean; currentCount: number; limit: number }> {
  if (userRole === "ADMIN") {
    const count = await prisma.plan.count({ where: { profileId } })
    return { canCreate: true, currentCount: count, limit: Infinity }
  }

  const membership = await getUserMembership(userId)
  if (!membership) {
    return { canCreate: false, currentCount: 0, limit: 0 }
  }

  const currentCount = await prisma.plan.count({ where: { profileId } })
  const limit = membership.plansPerProfileLimit

  return {
    canCreate: currentCount < limit,
    currentCount,
    limit,
  }
}

