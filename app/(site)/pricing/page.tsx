"use client"

import PricingSection1 from "@/components/ui/pricing-section-1"

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Green gradient background matching PricingSection1 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/20 to-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#18c260]/[0.08] via-green-500/[0.05] to-[#18c260]/[0.08]"></div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="relative z-10">
        <PricingSection1 />
      </div>
    </div>
  )
}

