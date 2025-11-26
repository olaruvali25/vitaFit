"use client"

import { useState, useEffect } from "react"
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
      case "BASIC":
        return "Basic"
      case "PLUS":
        return "Plus"
      case "FAMILY":
        return "Family"
      default:
        return plan
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-white">Loading subscription...</div>
  }

  if (!membership) {
    return <div className="text-white">Failed to load membership information</div>
  }

  const daysRemaining = getDaysRemaining(membership.trialEndsAt)
  const isTrial = membership.status === "TRIAL"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-white">Subscription</h2>
        <p className="text-sm text-white/70">
          Manage your membership and billing
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">{getPlanName(membership.plan)} Plan</CardTitle>
              <CardDescription className="mt-1">
                {getStatusBadge(membership.status)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTrial && daysRemaining !== null && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-emerald-500" />
                <p className="font-semibold text-emerald-500">Free Trial Active</p>
              </div>
              <p className="text-sm text-white/70">
                {daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
                  : "Trial has ended"}
              </p>
            </div>
          )}

          {membership.status === "ACTIVE" && membership.currentPeriodEnd && (
            <div>
              <p className="text-sm text-white/70 mb-1">Next renewal</p>
              <p className="font-medium text-white">
                {new Date(membership.currentPeriodEnd).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {membership.status === "INACTIVE" && (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
              <p className="text-sm text-yellow-500">
                Your subscription is inactive. Upgrade to continue using VitaFit.
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3 text-white">Plan Features</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-white">
                  {membership.profilesLimit === Infinity
                    ? "Unlimited"
                    : membership.profilesLimit}{" "}
                  profile{membership.profilesLimit !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-white">
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
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                Upgrade Plan
              </Button>
            )}
            {membership.status === "ACTIVE" && (
              <Button variant="outline">Manage Billing</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Available Plans</CardTitle>
          <CardDescription className="text-white/70">Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-white/70" />
                <h3 className="font-semibold text-white">Basic</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-white">Free</p>
              <p className="text-sm text-white/70 mb-4">7-day trial</p>
              <ul className="space-y-2 text-sm mb-4 text-white">
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

            <div className="rounded-lg border-2 border-emerald-500 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold text-white">Plus</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-white">$19/mo</p>
              <p className="text-sm text-white/70 mb-4">Best for individuals</p>
              <ul className="space-y-2 text-sm mb-4 text-white">
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

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-white/70" />
                <h3 className="font-semibold text-white">Family</h3>
              </div>
              <p className="text-2xl font-bold mb-1 text-white">$39/mo</p>
              <p className="text-sm text-white/70 mb-4">For families</p>
              <ul className="space-y-2 text-sm mb-4 text-white">
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

