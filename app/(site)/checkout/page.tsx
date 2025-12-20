"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"

type BillingCycle = "monthly" | "yearly"
type PlanId = "FREE_TRIAL" | "PRO" | "PLUS" | "FAMILY"

const PLAN_DETAILS: Record<
  PlanId,
  {
    name: string
    monthly: number
    yearly: number
    yearlyTotal: number
    trialDays?: number
    profiles: number
  }
> = {
  FREE_TRIAL: { name: "Free Trial", monthly: 0, yearly: 0, yearlyTotal: 0, trialDays: 14, profiles: 1 },
  PRO: { name: "Pro", monthly: 15, yearly: 10, yearlyTotal: 120, profiles: 1 },
  PLUS: { name: "Plus", monthly: 25, yearly: 15, yearlyTotal: 180, profiles: 2 },
  FAMILY: { name: "Family", monthly: 35, yearly: 25, yearlyTotal: 300, profiles: 4 },
}

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

function normalizePlan(planParam: string | null): PlanId {
  const normalized = (planParam || "PRO").toUpperCase().replace(/\s+/g, "_") as PlanId
  if (["FREE_TRIAL", "PRO", "PLUS", "FAMILY"].includes(normalized)) return normalized
  return "PRO"
}

function normalizeBilling(billingParam: string | null): BillingCycle {
  return billingParam === "yearly" ? "yearly" : "monthly"
}

function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useSupabase()
  const status = loading ? "loading" : user ? "authenticated" : "unauthenticated"

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planId = normalizePlan(searchParams.get("plan"))
  const billing = normalizeBilling(searchParams.get("billing"))

  const plan = useMemo(() => PLAN_DETAILS[planId], [planId])

  useEffect(() => {
    if (status === "unauthenticated") {
      const next = `/checkout?plan=${planId}&billing=${billing}`
      router.replace(`/login?redirect=${encodeURIComponent(next)}`)
    }
  }, [status, router, planId, billing])

  const handleCheckout = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, billing }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Failed to start checkout")
      }

      const { url } = await response.json()
      if (!url) {
        throw new Error("Checkout URL missing")
      }

      if (publishableKey) {
        const stripe = await loadStripe(publishableKey)
        if (stripe) {
          window.location.href = url
          return
        }
      }

      window.location.href = url
    } catch (err: any) {
      setError(err.message || "Checkout failed")
      setSubmitting(false)
    }
  }

  const price =
    billing === "yearly"
      ? { label: "$" + plan.yearly + "/mo billed $" + plan.yearlyTotal + " yearly", amount: plan.yearlyTotal }
      : { label: "$" + plan.monthly + "/mo", amount: plan.monthly }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 text-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">
            Complete your subscription. You can change plans anytime.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/50 bg-white/60 backdrop-blur-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-xl font-semibold">{plan.name}</p>
              <p className="text-sm text-gray-500">
                {plan.profiles} profile{plan.profiles !== 1 ? "s" : ""} included
              </p>
              {planId === "FREE_TRIAL" && (
                <p className="text-sm text-emerald-600 mt-1 font-medium">
                  {plan.trialDays} days free • no auto-renew
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">{price.label}</p>
              {billing === "monthly" && planId !== "FREE_TRIAL" && (
                <p className="text-xs text-gray-400 line-through">
                  ${Math.round(plan.monthly * 1.2)}/mo
                </p>
              )}
              <p className="text-sm text-gray-500 capitalize mt-1">{billing}</p>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
            <h3 className="font-semibold text-gray-900">Billing cycle</h3>
            <div className="flex gap-3">
              {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => {
                const isActive = billing === cycle
                return (
                  <button
                    key={cycle}
                    onClick={() => {
                      const url = `/checkout?plan=${planId}&billing=${cycle}`
                      router.replace(url)
                    }}
                    className={`rounded-full px-4 py-2 border transition ${
                      isActive ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : "border-gray-200 bg-white/50 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {cycle === "monthly" ? "Monthly" : "Yearly (save more)"}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={submitting || status === "unauthenticated"}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {submitting ? "Redirecting..." : "Proceed to payment"}
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Secure checkout powered by Stripe.</p>
          <p>If you have questions, contact support.</p>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 text-gray-900 flex items-center justify-center px-4">
        <p className="text-gray-500">Loading checkout...</p>
      </main>
    }>
      <CheckoutPageContent />
    </Suspense>
  )
}

