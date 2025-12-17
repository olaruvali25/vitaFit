"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useId, useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { GlowingEffect } from "./glowing-effect";

const PricingSwitch = ({
  button1,
  button2,
  onSwitch,
  className,
  layoutId,
}: {
  button1: string;
  button2: string;
  onSwitch: (value: string) => void;
  className?: string;
  layoutId?: string;
}) => {
  const [selected, setSelected] = useState("0");
  const uniqueId = useId();
  const switchLayoutId = layoutId || `switch-${uniqueId}`;

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div
      className={cn(
        "relative z-10 w-full flex rounded-full bg-[hsl(140,33%,92%)] border border-white/30 p-1",
        className,
      )}
    >
      <button
        onClick={() => handleSwitch("0")}
        className={cn(
          "relative z-10 w-full sm:h-14 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
          selected === "0"
            ? "text-white"
            : "text-black/70 hover:text-black",
        )}
      >
        {selected === "0" && (
          <motion.span
            layoutId={switchLayoutId}
            className="absolute top-0 left-0 sm:h-14 h-10 w-full rounded-full border-4 shadow-sm shadow-[#18c260] border-[#18c260] bg-gradient-to-t from-[#18c260] via-[#1FCC5F] to-[#18c260]"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative">{button1}</span>
      </button>
      <button
        onClick={() => handleSwitch("1")}
        className={cn(
          "relative z-10 w-full sm:h-14 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
          selected === "1"
            ? "text-white"
            : "text-black/70 hover:text-black",
        )}
      >
        {selected === "1" && (
          <motion.span
            layoutId={switchLayoutId}
            className="absolute top-0 left-0 sm:h-14 h-10 w-full rounded-full border-4 shadow-sm shadow-[#18c260] border-[#18c260] bg-gradient-to-t from-[#18c260] via-[#1FCC5F] to-[#18c260]"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative flex justify-center items-center gap-2">
          {button2}
        </span>
      </button>
    </div>
  );
};

type PlanConfig = {
  id: "FREE_TRIAL" | "PRO" | "PLUS" | "FAMILY"
  name: string
  monthlyPrice: number
  yearlyPrice: number
  yearlyTotal: number
  discount: number
  isFreeTrial?: boolean
  isPopular?: boolean
  features: string[]
}

const plans: PlanConfig[] = [
  {
    id: "FREE_TRIAL",
    name: "FREE TRIAL",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyTotal: 0,
    discount: 0,
    isFreeTrial: true,
    features: [
      "14 days full access",
      "1 personalized meal plan profile",
      "Weekly automated meal plan updates",
      "Recipe collection & favorites",
      "Cancel anytime, no credit card required",
      "Upgrade anytime during trial",
    ],
  },
  {
    id: "PRO",
    name: "PRO",
    monthlyPrice: 15,
    yearlyPrice: 10,
    yearlyTotal: 120,
    discount: 15,
    features: [
      "1 personalized meal plan profile",
      "Weekly automated meal plan updates",
      "Recipe collection & favorites",
      "Basic macro & calorie tracking",
      "Email support",
    ],
  },
  {
    id: "PLUS",
    name: "PLUS",
    monthlyPrice: 25,
    yearlyPrice: 15,
    yearlyTotal: 180,
    discount: 25,
    isPopular: true,
    features: [
      "2 personalized meal plan profiles",
      "Advanced meal customization options",
      "Share with a friend or family member",
      "Macro & calorie tracking for both profiles",
      "Shared meal schedules",
      "Email support with faster response",
      "Nutritional analysis & insights",
      "Custom macro targets per profile",
      "Export meal plans to PDF",
      "Priority feature requests",
    ],
  },
  {
    id: "FAMILY",
    name: "FAMILY",
    monthlyPrice: 35,
    yearlyPrice: 25,
    yearlyTotal: 300,
    discount: 35,
    features: [
      "4 personalized meal plan profiles",
      "Family-friendly meal suggestions",
      "Kid-approved recipe filters",
      "Batch cooking & meal prep guides",
      "Premium recipe collection access",
      "Priority customer support",
      "Family nutrition dashboard",
    ],
  },
];

function PricingSection1Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useSupabase()
  const status = loading ? "loading" : user ? "authenticated" : "unauthenticated"
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  
  const profileId = searchParams.get("profileId")
  const assessmentCompleted = searchParams.get("assessment") === "completed"
  const trialAvailable = searchParams.get("trial") === "available"
  const upgradePlan = searchParams.get("upgrade")?.toUpperCase().replace(/\s+/g, "_") // "PLUS", "FAMILY", etc.

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const toggleYearly = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  const goToCheckout = (planId: string) => {
    const billing = isYearly ? "yearly" : "monthly"
    const target = `/checkout?plan=${planId}&billing=${billing}${profileId ? `&profileId=${profileId}` : ""}${assessmentCompleted ? `&assessment=completed` : ""}`

    if (status === "unauthenticated") {
      router.push(`/login?redirect=${encodeURIComponent(target)}`)
      return
    }

    router.push(target)
  }

  return (
    <section id="pricing" className="relative py-32 bg-gradient-to-b from-emerald-50/80 via-emerald-50/75 via-emerald-100/70 via-emerald-200/65 via-emerald-300/60 via-emerald-400/55 via-emerald-500/50 via-emerald-600/45 via-emerald-700/40 via-emerald-800/35 via-emerald-900/30 via-green-800/25 via-green-900/20 via-green-950/15 to-slate-950 overflow-hidden scroll-mt-20">
      {/* Static Background Effects */}
      <div className="absolute inset-0" suppressHydrationWarning>
        <div className="absolute inset-0 bg-gradient-to-b from-[#18c260]/[0.12] via-[#18c260]/[0.11] via-[#18c260]/[0.10] via-[#18c260]/[0.09] via-[#18c260]/[0.08] via-[#18c260]/[0.07] via-[#18c260]/[0.06] via-green-500/[0.05] to-[#18c260]/[0.08]" suppressHydrationWarning />
      </div>
      
      <div className="px-4 pt-10 w-full mx-auto relative z-10" ref={pricingRef} data-pricing-section>
        <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="flex items-center justify-center mb-4"
          >
            <Zap className="h-5 w-5 text-[#18c260] fill-[#18c260] mr-2" />
            <span className="text-[#18c260] font-medium">Choose Your Plan</span>
          </TimelineContent>

          <h1 className="md:text-5xl sm:text-4xl text-3xl font-semibold text-white mb-4 leading-[120%]">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.06}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: 0.1,
              }}
            >
              Start Your Journey Today
            </VerticalCutReveal>
          </h1>

          <TimelineContent
            as="p"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-xl text-white/80 mb-8"
          >
            Choose the perfect plan for your health and fitness goals
          </TimelineContent>

          {/* Billing Toggle */}
          <TimelineContent
            as="div"
            animationNum={2}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="flex justify-center mb-12"
          >
            <div className="w-full max-w-md">
              <PricingSwitch
                button1="Monthly"
                button2="Yearly"
                onSwitch={toggleYearly}
                className="grid grid-cols-2 w-full"
              />
            </div>
          </TimelineContent>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const isFreeTrial = plan.isFreeTrial;
              const isPopular = plan.isPopular;
              // Highlight the plan if it matches the upgrade parameter
              const isUpgradeTarget = upgradePlan && plan.id === upgradePlan;
              
              return (
                <TimelineContent
                  key={plan.name}
                  as="div"
                  animationNum={3 + index}
                  timelineRef={pricingRef}
                  customVariants={revealVariants}
                  className={cn(
                    "relative",
                    (isPopular || isUpgradeTarget) && "md:col-span-2 lg:col-span-1 lg:scale-105 lg:z-10"
                  )}
                >
                  <GlowingEffect spread={50} blur={25} borderWidth={isPopular ? 3 : 2} />
                  <div className={cn(
                    "relative bg-white/10 backdrop-blur-xl rounded-xl border shadow-xl p-6 h-full flex flex-col",
                    (isPopular || isUpgradeTarget)
                      ? "border-[#18c260]/50 shadow-[#18c260]/20 shadow-2xl" 
                      : "border-white/30"
                  )}>
                    {(isPopular || isUpgradeTarget) && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#18c260] to-[#1FCC5F] text-white text-xs font-bold rounded-full shadow-lg">
                          {isUpgradeTarget ? "UPGRADE TO THIS PLAN" : "MOST POPULAR"}
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className={cn(
                        "text-2xl font-bold mb-2",
                        (isPopular || isUpgradeTarget) ? "text-[#18c260]" : "text-white"
                      )}>
                        {plan.name}
                      </h3>
                      {!isFreeTrial && isYearly && plan.discount > 0 && (
                        <span className="inline-block px-3 py-1 bg-[#18c260]/20 text-[#18c260] text-xs font-semibold rounded-full mb-4">
                          Save {plan.discount}%
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      {isFreeTrial ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">FREE</span>
                          </div>
                          <p className="text-sm text-white/60 mt-1">14 days, no credit card</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white flex items-baseline">
                              $<NumberFlow value={isYearly ? plan.yearlyPrice : plan.monthlyPrice} />
                            </span>
                            <span className="text-white/70">/month</span>
                          </div>
                          {isYearly && plan.yearlyTotal > 0 && (
                            <p className="text-sm text-white/60 mt-1">
                              Billed ${plan.yearlyTotal} yearly
                            </p>
                          )}
                          {!isYearly && plan.monthlyPrice > 0 && (
                            <p className="text-sm text-white/60 line-through mt-1">
                              ${Math.round(plan.monthlyPrice * 1.2)}/month
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <ul className={cn(
                      "space-y-3 flex-1 mb-6",
                      isPopular && "space-y-2.5"
                    )}>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0",
                            isPopular ? "bg-[#18c260] shadow-md shadow-[#18c260]/50" : "bg-[#18c260]"
                          )}>
                            <CheckCheck className="h-3 w-3 text-white" />
                          </div>
                          <span className={cn(
                            "text-sm",
                            isPopular ? "text-white font-medium" : "text-white/90"
                          )}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => {
                        setLoadingPlan(plan.name)
                        goToCheckout(plan.id)
                      }}
                      disabled={loadingPlan === plan.name}
                      className={cn(
                        "w-full font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                        isFreeTrial
                          ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                          : isPopular
                          ? "bg-gradient-to-r from-[#18c260] to-[#1FCC5F] text-white shadow-lg shadow-[#18c260]/30 hover:shadow-[#18c260]/50"
                          : "bg-[#18c260] text-white hover:bg-[#1FCC5F]"
                      )}
                    >
                      {loadingPlan === plan.name ? "Processing..." : isFreeTrial ? "Start Free Trial" : "Get Started"}
                    </button>
                  </div>
                </TimelineContent>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export default function PricingSection1() {
  return (
    <Suspense fallback={
      <section className="relative py-32 bg-gradient-to-br from-black via-green-950/20 to-black">
        <div className="px-4 pt-10 w-full mx-auto text-center text-white">
          <p>Loading pricing...</p>
        </div>
      </section>
    }>
      <PricingSection1Content />
    </Suspense>
  )
}

