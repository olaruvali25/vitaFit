"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, AlertTriangle, Crown } from "lucide-react"

interface MembershipInfo {
  plan: string
  status: string
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  canUseFeatures: boolean
  profilesLimit: number
  plansPerProfileLimit: number
  hasUsedTrial?: boolean
  canStartTrial?: boolean
  isTrialExpired?: boolean
}

interface SubscriptionTabProps {
  isMainProfile?: boolean
}

export function SubscriptionTab({ isMainProfile = true }: SubscriptionTabProps) {
  const router = useRouter()
  const [membership, setMembership] = useState<MembershipInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activatingTrial, setActivatingTrial] = useState(false)
  const [trialError, setTrialError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembership()
  }, [])

  const fetchMembership = async () => {
    try {
      const response = await fetch("/api/membership")
      if (response.ok) {
        const data = await response.json()
        setMembership(data)
      }
    } catch (err) {
      console.error("Failed to fetch membership:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrial = async () => {
    setActivatingTrial(true)
    setTrialError(null)
    
    try {
      const response = await fetch("/api/membership/activate-trial", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        setTrialError(data.error || "Failed to activate trial")
        return
      }
      
      // Refresh membership data
      await fetchMembership()
    } catch (err) {
      console.error("Failed to activate trial:", err)
      setTrialError("Failed to activate trial. Please try again.")
    } finally {
      setActivatingTrial(false)
    }
  }

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return days > 0 ? days : 0
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TRIAL":
        return <Badge className="bg-emerald-500">Free Trial</Badge>
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>
      case "EXPIRED_TRIAL":
        return <Badge className="bg-orange-500">Trial Expired</Badge>
      case "INACTIVE":
        return <Badge variant="outline" className="border-red-300 text-red-600">Inactive</Badge>
      case "CANCELED":
        return <Badge variant="outline">Canceled</Badge>
      default:
        return <Badge variant="outline">No Plan</Badge>
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "PRO":
        return "Pro"
      case "PLUS":
        return "Plus"
      case "FAMILY":
        return "Family"
      case "FREE_TRIAL":
        return "Free Trial"
      default:
        return plan
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-900">Loading subscription...</div>
  }

  if (!membership) {
    return <div className="text-gray-900">Failed to load membership information</div>
  }

  const daysRemaining = getDaysRemaining(membership.trialEndsAt)
  const isTrial = membership.status === "TRIAL"
  const isActive = membership.status === "ACTIVE"
  const isExpiredTrial = membership.status === "EXPIRED_TRIAL"
  const isInactive = membership.status === "INACTIVE"
  const hasNoPlan = membership.status === "NONE"
  const hasUsedTrial = membership.hasUsedTrial ?? false
  const canStartTrial = membership.canStartTrial ?? !hasUsedTrial

  // Non-main profiles can only view, not manage
  if (!isMainProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold mb-1 text-gray-900 tracking-tight">Subscription</h2>
          <p className="text-base text-gray-600 mb-3">
            View your current membership
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm text-gray-500">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900">
                {hasNoPlan ? "No membership" : getPlanName(membership.plan)}
              </p>
            </div>
            {getStatusBadge(membership.status)}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600">
              Subscription management is available on the main profile.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold mb-1 text-gray-900 tracking-tight">Subscription</h2>
        <p className="text-base text-gray-600 mb-3">
          Manage your membership and billing
        </p>
        
        {/* Status Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(24,194,96,0.6)]" />
            {hasNoPlan
              ? "No membership yet"
              : isExpiredTrial
              ? "Trial Expired"
              : isTrial
              ? "Free Trial"
              : isInactive
              ? "Subscription Inactive"
              : getPlanName(membership.plan)}
          </div>

          {/* Show days remaining for trial */}
          {isTrial && daysRemaining !== null && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </Badge>
          )}
        </div>
      </div>

      {/* Trial Error Message */}
      {trialError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{trialError}</p>
        </div>
      )}

      {/* No Plan State */}
      {hasNoPlan && (
        <div className="rounded-lg border border-gray-200 bg-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-lg font-semibold text-gray-900">Get Started with VitaFit</p>
              <p className="text-sm text-gray-600">
                {canStartTrial 
                  ? "Start your 14-day free trial to unlock all features."
                  : "Choose a plan to unlock all features."}
              </p>
            </div>
          </div>
          
          {canStartTrial ? (
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleStartTrial}
              disabled={activatingTrial}
            >
              {activatingTrial ? "Activating..." : "Start now for free!"}
            </Button>
          ) : (
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => router.push("/pricing")}
            >
              Upgrade now!
            </Button>
          )}
        </div>
      )}

      {/* Expired Trial State */}
      {isExpiredTrial && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-lg font-semibold text-gray-900">Your Free Trial Has Expired</p>
              <p className="text-sm text-gray-600">
                Upgrade to a paid plan to continue using VitaFit and unlock your progress.
              </p>
            </div>
          </div>
          
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => router.push("/pricing")}
          >
            Upgrade now!
          </Button>
        </div>
      )}

      {/* Inactive Subscription State */}
      {isInactive && !isExpiredTrial && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <p className="text-lg font-semibold text-gray-900">Subscription Inactive</p>
              <p className="text-sm text-gray-600">
                Your subscription is no longer active. Renew to regain access to all features.
              </p>
            </div>
          </div>
          
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => router.push("/pricing")}
          >
            Renew Subscription
          </Button>
        </div>
      )}

      {/* Active Trial or Paid Plan - Show Manage Button */}
      {(isTrial || isActive) && (
        <div className="rounded-lg border border-gray-200 bg-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm text-gray-500">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900">
                {getPlanName(membership.plan)}
              </p>
            </div>
            {getStatusBadge(membership.status)}
          </div>

          {isTrial && daysRemaining !== null && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>{daysRemaining}</strong> day{daysRemaining !== 1 ? "s" : ""} left in your free trial.
                Upgrade anytime to keep your progress.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 flex-wrap">
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => router.push("/account/manage-subscription")}
            >
              Manage Subscription
            </Button>
            
            {isTrial && (
              <Button
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Paid Plan
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
