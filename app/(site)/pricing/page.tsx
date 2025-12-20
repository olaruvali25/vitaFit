"use client"

import PricingSection1 from "@/components/ui/pricing-section-1"

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40">
      {/* Pricing Section */}
      <div className="relative z-10">
        <PricingSection1 />
      </div>
    </div>
  )
}
