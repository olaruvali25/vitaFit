"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Basic",
      description: "Perfect for individuals starting their fitness journey",
      monthlyPrice: 15,
      yearlyPrice: 120,
      features: [
        "1 profile",
        "Weekly AI meal plan",
        "Weekly AI workout plan",
        "Motivational reminders",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Plus",
      description: "Ideal for serious fitness enthusiasts",
      monthlyPrice: 25,
      yearlyPrice: 180,
      features: [
        "2 profiles",
        "Everything in Basic",
        "Priority plan generation",
        "Advanced customization",
        "Progress tracking",
        "Priority email support",
      ],
      popular: true,
    },
    {
      name: "Family",
      description: "Best value for families and groups",
      monthlyPrice: 35,
      yearlyPrice: 300,
      features: [
        "Up to 4 profiles",
        "All features unlocked",
        "Family meal planning",
        "Monthly check-ins",
        "Shared meal prep guides",
        "24/7 priority support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="container px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include our AI-powered meal planning and workout routines.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as "monthly" | "yearly")}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge variant="secondary" className="ml-2">
                  Save 33%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
            const savings = billingPeriod === "yearly" 
              ? Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)
              : 0

            return (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground ml-2">
                        /{billingPeriod === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        ${plan.monthlyPrice}/month billed annually
                      </p>
                    )}
                    {savings > 0 && (
                      <p className="text-sm text-primary font-medium mt-1">
                        Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}/year
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href="/assessment">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We offer a free assessment to generate your personalized plan. No credit card required to get started.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I'm not satisfied?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We offer a 7-day money-back guarantee. If you're not happy with your plan, contact us for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

