"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Users, Zap } from "lucide-react"

interface MembershipInfo {
  plan: string
  status: string
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  canUseFeatures: boolean
  profilesLimit: number
  plansPerProfileLimit: number
}

export function SubscriptionTab() {
  const router = useRouter()
  const [membership, setMembership] = useState<MembershipInfo | null>(null)
  const [loading, setLoading] = useState(true)

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
      case "CANCELED":
        return <Badge variant="outline">Canceled</Badge>
      default:
        return <Badge variant="outline">Inactive</Badge>
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "PLUS":
        return "Plus"
      case "FAMILY":
        return "Family"
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold mb-1 text-gray-900 tracking-tight">Subscription</h2>
        <p className="text-base text-gray-600 mb-3">
          Manage your membership and billing
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(24,194,96,0.6)]" />
          {membership.status === "INACTIVE"
            ? "No plan yet"
            : membership.status === "TRIAL"
            ? "Free Trial"
            : getPlanName(membership.plan)}
        </div>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border-emerald-200/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">{getPlanName(membership.plan)} Plan</CardTitle>
              <CardDescription className="mt-1">
                {getStatusBadge(membership.status)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTrial && daysRemaining !== null && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                <p className="font-semibold text-emerald-600">Free Trial Active</p>
              </div>
              <p className="text-sm text-gray-600">
                {daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
                  : "Trial has ended"}
              </p>
            </div>
          )}

          {membership.status === "ACTIVE" && membership.currentPeriodEnd && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Next renewal</p>
              <p className="font-medium text-gray-900">
                {new Date(membership.currentPeriodEnd).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {membership.status === "INACTIVE" && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-4">
              <p className="text-sm text-yellow-700">
                Your subscription is inactive. Upgrade to continue using VitaFit.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold mb-3 text-gray-900">Plan Features</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-gray-700">
                  {membership.profilesLimit === Infinity
                    ? "Unlimited"
                    : membership.profilesLimit}{" "}
                  profile{membership.profilesLimit !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-gray-700">
                  {membership.plansPerProfileLimit === Infinity
                    ? "Unlimited"
                    : membership.plansPerProfileLimit}{" "}
                  plans per profile
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {membership.status !== "ACTIVE" && (
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => router.push("/pricing")}
              >
                Upgrade Plan
              </Button>
            )}
            {membership.status === "ACTIVE" && (
              <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">Manage Billing</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-xl border-emerald-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Available Plans</CardTitle>
          <CardDescription className="text-gray-600">Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-100 bg-white/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Free Trial</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-gray-900">Free</p>
              <p className="text-sm text-gray-500 mb-4">14-day trial (no auto-renew)</p>
              <ul className="space-y-2 text-sm mb-4 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  1 profile
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  3 plans per profile
                </li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-emerald-500 bg-white/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold text-gray-900">Pro</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-gray-900">$15/mo or $10/mo yearly ($120)</p>
              <p className="text-sm text-gray-500 mb-4">For one person (1 profile)</p>
              <ul className="space-y-2 text-sm mb-4 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  1 profile
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  5 plans per profile
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Plus</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-gray-900">$25/mo or $15/mo yearly ($180)</p>
              <p className="text-sm text-gray-500 mb-4">For two profiles</p>
              <ul className="space-y-2 text-sm mb-4 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  2 profiles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  5 plans per profile
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Family</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-gray-900">$35/mo or $25/mo yearly ($300)</p>
              <p className="text-sm text-gray-500 mb-4">For families (up to 4 profiles)</p>
              <ul className="space-y-2 text-sm mb-4 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  4 profiles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  10 plans per profile
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

