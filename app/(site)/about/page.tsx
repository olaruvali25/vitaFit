"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeInView } from "@/components/ui/fade-in-view"
import { CheckCircle2, Heart, Target, Users } from "lucide-react"
import { FeatureShowcase } from "@/components/feature-showcase"
import { GradualSpacing, VariableFontHoverByRandomLetter } from "@/components/ui/text-effect"
import { CtaCard } from "@/components/ui/cta-card"
import { GradientCard } from "@/components/ui/gradient-card"

export default function AboutPage() {
  const showcaseTabs = [
    {
      value: "week-view",
      label: "Weekly View",
      src: "/images/transformation-before-1.png",
    },
    {
      value: "meals",
      label: "Meals & Macros",
      src: "/images/transformation-before-2.png",
    },
    {
      value: "adjustments",
      label: "Smart Adjustments",
      src: "/images/transformation-before-3.png",
    },
  ]

  const showcaseSteps = [
    {
      id: "step-1",
      title: "Tell us how you really live",
      text:
        "To fit health into your life, not force your life around a diet. Share your work schedule, sleep, training days, and the foods you actually enjoy!",
    },
    {
      id: "step-2",
      title: "Get a weekly plan that fits",
      text:
        "To make getting in shape feel clear, not confusing. VitaFit builds your meals around your time, your calories, and your preferences. Each day has a clear structure, so you always know what to eat!",
    },
    {
      id: "step-3",
      title: "Adjust as life happens",
      text:
        "To help you build habits you’re proud of and results you can actually see. Busy week? Extra dinner out? Progress speeding up or slowing down? Update a few details and VitaFit recalculates macros, meals, and training so your plan always matches your reality.",
    },
  ]

  return (
    <div className="relative px-4 py-16 md:py-24">
      {/* Page-specific green-tinted background to lean into VitaFit's emerald aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-emerald-950/70 via-emerald-900/50 to-transparent" />
      <div className="container mx-auto max-w-4xl space-y-16">
        {/* 1️⃣ Hero (top of About page) */}
        <FadeInView>
          <section className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              About VitaFit
            </div>

            <h1 className="text-balance text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
              Built for real people with{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-400 bg-clip-text text-transparent">
                real lives.
              </span>
            </h1>

            <p className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed">
              VitaFit was created for anyone who wants to get in shape{" "}
              but is tired of guesswork, guilt, and "all or nothing" plans.
            </p>
          </section>
        </FadeInView>

        {/* Feature Showcase directly under hero */}
        <FadeInView delay={0.05}>
          <FeatureShowcase
            title="Your goals. Your lifestyle. One simple system."
            description="See how VitaFit turns your goals, schedule, and food preferences into a clear weekly structure you can actually follow, without starving, guessing, or rebuilding your life around a diet."
            stats={["3-minute setup", "100% lifestyle-based", "No generic macros"]}
            steps={showcaseSteps}
            tabs={showcaseTabs}
            defaultTab="week-view"
            panelMinHeight={520}
            className="mt-3 mb-3  rounded-3xl border-none bg-white/5/5 shadow-[0_18px_80px_rgba(15,23,42,0.65)]"
          />
        </FadeInView>

        {/* Animated Feature Cards */}
        <FadeInView delay={0.15}>
          <section className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Our mission is simple.
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 w-2500px  max-w-[2000px] mx-auto px-6">
              <GradientCard
                gradient="orange"
                badgeText="Nutrition"
                badgeColor="#FF6B35"
                title="Tell us how you really live."
                description="To fit health into your life, not force your life around a diet. Share your work schedule, sleep, training days, and the foods you actually enjoy"
                ctaText="Learn more"
                ctaHref="#"
                imageUrl=""
              />
              <GradientCard
                gradient="purple"
                badgeText="Fitness"
                badgeColor="#9333EA"
                title="Get a weekly plan that fits."
                description="To make getting in shape feel clear, not confusing. VitaFit builds your meals around your time, your calories, and your preferences. Each day has a clear structure, so you always know what to eat!"
                ctaText="Learn more"
                ctaHref="#"
                imageUrl=""
              />
              <GradientCard
                gradient="green"
                badgeText="Progress"
                badgeColor="#10B981"
                title="Adjust as life happens."
                description="To help you build habits you're proud of and results you can actually see. Busy week? Extra dinner out? Progress speeding up or slowing down? Update a few details and VitaFit recalculates macros, meals, and training so your plan always matches your reality."
                ctaText="Learn more"
                ctaHref="#"
                imageUrl=""
              />
            </div>
          </section>
        </FadeInView>

        {/* 2️⃣ Short story (founder-style, brand-neutral) */}
        <FadeInView delay={0.1}>
          <section>
            <Card className="border-none bg-white/[0.02] backdrop-blur-xl">
              <CardHeader className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-emerald-500/15 p-2">
                  <Heart className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl text-white">Why VitaFit was built</CardTitle>
                  <CardDescription className="text-sm text-white/60 mt-1">
                    Not another fitness app yelling macros at you. A system that starts with your actual life.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm md:text-base text-white/70 leading-relaxed">
                <p>
                  Most fitness apps throw numbers, charts, and generic plans at you.
                  <br />
                  “Eat 1,600 calories.” “Train 5x per week.” “Hit 10k steps.”
                </p>
                <p>
                  But they don&apos;t ask the most important questions:
                </p>
                <ul className="space-y-1.5 pl-4 text-white/70 list-disc">
                  <li>What does your actual day look like?</li>
                  <li>How much time do you really have?</li>
                  <li>What food do you genuinely enjoy — and what do you hate?</li>
                </ul>
                <p>
                  VitaFit was built to fix that.
                  <br />
                  Not by shouting louder… but by listening better.
                </p>
              </CardContent>
            </Card>
          </section>
        </FadeInView>

        {/* 3️⃣ Mission section */}
        <FadeInView delay={0.2}>
          <section>
            <Card className="border-none bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 mb-3">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">
                    Our mission is simple
                  </span>
                </div>
                <CardTitle className="text-2xl text-white">Our mission is simple:</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-3">
                {[
                  "To make getting in shape feel clear, not confusing.",
                  "To fit health into your life, not force your life around a diet.",
                  "To remove the shame and “start over Monday” cycle.",
                  "To help you build habits you’re proud of — and results you can actually see.",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-sm md:text-base text-white/75">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </FadeInView>

        {/* 4️⃣ CTA Card with VitaFit message */}
        <FadeInView delay={0.3} duration={0.7} y={24}>
            <section className="flex justify-center items-center w-50 mx-left-5 min-w-7xl max-w-8xl mx-auto px-4 h-70 w-400 mx-400  justify-center items-center">
            <CtaCard
              imageSrc=""
              title="VitaFit is ready when you are!"    
              description="You don't need a perfect routine, you need something that understands your schedule, your cravings, your lifestyle, your limits and your goals! Just a plan built for your real life!"
              inputPlaceholder="Email address"
              buttonText="FREE PLAN!" 
              className="mt-8 bg-white/5 backdrop-blur-xl border-emerald-400 -translate-x-10 hover:text-white"
            />
          </section>
        </FadeInView>

        {/* 5️⃣ Who it’s for */}
        <FadeInView delay={0.4}>
          <section>
            <Card className="border-none bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-white">
                  VitaFit is for you if…
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
                {[
                  "You’ve tried strict diets and always bounced back.",
                  "You’re busy, and you need clarity, not 100 more “tips”.",
                  "You want guidance without paying hundreds for a coach every month.",
                  "You’re ready to stop guessing — and finally follow a plan built for your life.",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-emerald-500/15 p-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p className="text-white/75">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </FadeInView>

        {/* 6️⃣ Final emotional closer + CTA */}
        <FadeInView delay={0.5}>
          <section>
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
              <CardHeader className="space-y-4 text-center relative z-10">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1">
                  <Users className="h-4 w-4 text-emerald-300" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-100/90">
                    Why we care
                  </span>
                </div>
                <CardTitle className="text-xl md:text-2xl text-white">
                  Your life doesn’t have to revolve around fitness.
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-emerald-50/90 max-w-2xl mx-auto">
                  But your fitness can quietly support the life you want.
                  <br />
                  That’s what VitaFit is here for.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8 text-center relative z-10">
                <Button
                  size="lg"
                  asChild
                  className="px-8 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.45)] transition-shadow"
                >
                  <Link href="/assessment">Take the Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </FadeInView>
      </div>
    </div>
  )
}

