// Subscription tier type (replacing Prisma enum)
export type SubscriptionTier = 'free_trial' | 'pro' | 'plus' | 'family'

export const PROFILE_LIMITS: Record<SubscriptionTier, number> = {
  free_trial: 1,
  pro: 1,
  plus: 2,
  family: 4,
}

export function canAccessTracker(tier: SubscriptionTier): boolean {
  return tier !== "free_trial"
}

export function isUpgradeAllowed(from: SubscriptionTier, to: SubscriptionTier): boolean {
  if (from === to) return false
  const allowed: Record<SubscriptionTier, SubscriptionTier[]> = {
    free_trial: ["pro", "plus", "family"],
    pro: ["plus", "family"],
    plus: ["family"],
    family: [],
  }
  return allowed[from]?.includes(to) ?? false
}

export function isDowngradeAllowed(from: SubscriptionTier, to: SubscriptionTier): boolean {
  if (from === to) return false
  // Allowed: family->plus, plus->pro. Others blocked per spec.
  if (from === "family" && to === "plus") return true
  if (from === "plus" && to === "pro") return true
  return false
}
