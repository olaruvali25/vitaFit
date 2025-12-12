import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { requireAuth } from "@/lib/auth-utils"

type BillingCycle = "monthly" | "yearly"
type PlanId = "FREE_TRIAL" | "PRO" | "PLUS" | "FAMILY"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn("[Checkout] STRIPE_SECRET_KEY is missing. Checkout will fail until configured.")
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null

const PLAN_CONFIG: Record<
  PlanId,
  {
    displayName: string
    priceIds: Partial<Record<BillingCycle, string>>
    trialDays?: number
    autoRenew?: boolean
  }
> = {
  FREE_TRIAL: {
    displayName: "Free Trial",
    priceIds: {
      monthly: process.env.STRIPE_PRICE_FREE_TRIAL || "",
    },
    trialDays: 14,
    autoRenew: false,
  },
  PRO: {
    displayName: "Pro",
    priceIds: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY || "",
    },
    autoRenew: true,
  },
  PLUS: {
    displayName: "Plus",
    priceIds: {
      monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY || "",
      yearly: process.env.STRIPE_PRICE_PLUS_YEARLY || "",
    },
    autoRenew: true,
  },
  FAMILY: {
    displayName: "Family",
    priceIds: {
      monthly: process.env.STRIPE_PRICE_FAMILY_MONTHLY || "",
      yearly: process.env.STRIPE_PRICE_FAMILY_YEARLY || "",
    },
    autoRenew: true,
  },
}

function normalizePlanId(plan: string | null): PlanId | null {
  if (!plan) return null
  const normalized = plan.toUpperCase().replace(/\s+/g, "_") as PlanId
  if (["FREE_TRIAL", "PRO", "PLUS", "FAMILY"].includes(normalized)) {
    return normalized
  }
  return null
}

function normalizeBilling(billing: string | null): BillingCycle {
  return billing === "yearly" ? "yearly" : "monthly"
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    )
  } 

  let user
  try {
    user = await requireAuth()
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    throw error
  }

  const body = await request.json().catch(() => ({}))
  const plan = normalizePlanId(body.plan)
  const billing = normalizeBilling(body.billing)

  if (!plan) {
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    )
  }

  const config = PLAN_CONFIG[plan]
  const priceId = config.priceIds[billing] || config.priceIds.monthly

  if (!priceId) {
    return NextResponse.json(
      { error: `Missing Stripe price ID for ${plan} (${billing})` },
      { status: 500 }
    )
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000"

  const successUrl = `${origin}/account?tab=subscription&checkout=success`
  const cancelUrl = `${origin}/pricing?checkout=cancelled`

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: priceId,
      quantity: 1,
    },
  ]

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: {
      plan,
      billingCycle: billing,
      userId: (user as any).id,
      autoRenew: config.autoRenew ? "true" : "false",
    },
  }

  // For the free trial, force no auto-renew by cancelling at trial end
  // FREE TRIAL: no auto-renew, Stripe handles trial end
if (plan === "FREE_TRIAL" && config.trialDays) {
  subscriptionData.trial_period_days = config.trialDays
}


  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    subscription_data: subscriptionData,
    metadata: {
      plan,
      billingCycle: billing,
      userId: (user as any).id,
    },
    customer_email: (user as any).email || undefined,
  })

  return NextResponse.json({ url: session.url })
}

