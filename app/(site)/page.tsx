"use client"

import HeroSection from "@/components/hero-section"
import FeaturesCards from "@/components/ui/features-cards"
import PricingSection1 from "@/components/ui/pricing-section-1"
import { LandingAccordionItem } from "@/components/ui/landing-accordion-item"
import { PremiumContact } from "@/components/ui/premium-contact"

export default function HomePage() {
  return (
    <div className="flex flex-col relative z-10">
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

