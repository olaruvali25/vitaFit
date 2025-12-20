"use client"

import { Suspense } from "react"

import HeroSection from "@/components/hero-section"
import FeaturesCards from "@/components/ui/features-cards"
import PricingSection1 from "@/components/ui/pricing-section-1"
import { LandingAccordionItem } from "@/components/ui/landing-accordion-item"
import { PremiumContact } from "@/components/ui/premium-contact"

function HomeContent() {
  return (
    <div className="flex flex-col relative z-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40">
      {/* Hero Section with Integrated Assessment Form */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesCards />

      {/* Landing Accordion Section */}
      <LandingAccordionItem />

      {/* Pricing Section */}
      <PricingSection1 />

      {/* Contact Section */}
      <PremiumContact />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white/80">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}

