"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import AssessmentForm from "@/components/forms/AssessmentForm"
import type { AssessmentFormData } from "@/components/forms/AssessmentForm"
import { PersonalizedLoading } from "@/components/assessment/PersonalizedLoading"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"
import { Loader2 } from "lucide-react"

function AssessmentPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [planId, setPlanId] = useState<string | null>(null)

  // Check if we're returning from pricing/trial activation
  useEffect(() => {
    const assessmentCompleted = searchParams.get("assessment")
    const profileId = searchParams.get("profileId")
    
    if (assessmentCompleted === "completed" && profileId && status === "authenticated") {
      // User completed assessment, activated trial/membership, now generate plan
      const storedData = sessionStorage.getItem("assessmentData")
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          setAssessmentData(data)
          setShowLoading(true)
          generatePlanAfterMembership(profileId, data)
        } catch (e) {
          console.error("Error parsing assessment data:", e)
        }
      }
    }
  }, [searchParams, status])

  const generatePlanAfterMembership = async (profileId: string, data: AssessmentFormData) => {
    try {
      setError(null)
      // Submit assessment to trigger Make.com webhook
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to submit assessment" }))
        throw new Error(errorData.error || "Failed to submit assessment")
      }

      console.log("Assessment submitted, starting to poll for plan...")
      // Poll for plan generation (Make.com will call /api/plans/from-make)
      // Don't await - let it run in background and continue polling
      pollForPlan(profileId)
    } catch (err: any) {
      console.error("Error generating plan:", err)
      setError(err.message || "Failed to generate plan")
      // Don't stop loading - retry after 5 seconds
      setTimeout(() => {
        generatePlanAfterMembership(profileId, data)
      }, 5000)
    }
  }

  const pollForPlan = async (profileId: string, maxAttempts = 300) => {
    // Poll for up to 10 minutes (300 attempts * 2 seconds = 600 seconds = 10 minutes)
    console.log(`Starting to poll for plan with profileId: ${profileId}`)
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds between checks
      
      try {
        console.log(`Polling attempt ${i + 1}/${maxAttempts} for plan...`)
        const response = await fetch(`/api/plans?profileId=${profileId}`)
        
        if (response.ok) {
          const plans = await response.json()
          console.log(`Plans response:`, plans)
          
          if (plans && Array.isArray(plans) && plans.length > 0) {
            // Find the most recent plan (should be the one just generated)
            const latestPlan = plans.sort((a: any, b: any) => 
              new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime()
            )[0]
            
            console.log(`Plan found! Plan ID: ${latestPlan.id}`)
            
            // Verify plan has days and meals
            if (latestPlan.days && latestPlan.days.length > 0) {
              const hasMeals = latestPlan.days.some((day: any) => 
                day.meals && day.meals.length > 0
              )
              
              if (hasMeals) {
                console.log(`Plan is complete with meals! Plan ID: ${latestPlan.id}`)
                setPlanId(latestPlan.id)
                sessionStorage.removeItem("assessmentData")
                // Wait a moment for UI to update, then redirect
                setTimeout(() => {
                  window.location.href = `/plans/${latestPlan.id}`
                }, 2000)
                return
              } else {
                console.log(`Plan found but no meals yet, continuing to poll...`)
              }
            } else {
              console.log(`Plan found but no days yet, continuing to poll...`)
            }
          } else {
            console.log(`No plans found yet, continuing to poll...`)
          }
        } else {
          const errorText = await response.text()
          console.error(`Failed to fetch plans: ${response.status}`, errorText)
        }
      } catch (err) {
        console.error(`Error checking for plan (attempt ${i + 1}):`, err)
      }
    }
    
    // If we get here, we've exhausted all attempts
    console.error(`Plan generation timeout after ${maxAttempts} attempts`)
    
    // Check one more time if plan exists (maybe it was created but we missed it)
    try {
      const finalCheck = await fetch(`/api/plans?profileId=${profileId}`)
      if (finalCheck.ok) {
        const plans = await finalCheck.json()
        if (plans && Array.isArray(plans) && plans.length > 0) {
          const latestPlan = plans.sort((a: any, b: any) => 
            new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime()
          )[0]
          console.log(`Found plan on final check:`, latestPlan.id)
          setPlanId(latestPlan.id)
          sessionStorage.removeItem("assessmentData")
          setTimeout(() => {
            window.location.href = `/plans/${latestPlan.id}`
          }, 2000)
          return
        }
      }
    } catch (err) {
      console.error("Final check failed:", err)
    }
    
    // Still no plan - show error but keep polling in background
    setError("Plan generation is taking longer than expected. Please wait...")
    // Don't stop loading - keep trying
    // Continue polling in background
    setTimeout(() => pollForPlan(profileId, 300), 10000) // Try again after 10 seconds
  }

  const handleFormSubmit = async (data: AssessmentFormData) => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      // Store assessment data and redirect to signup/login
      sessionStorage.setItem("assessmentData", JSON.stringify(data))
      router.push(`/signup?redirect=assessment`)
      return
    }

    if (status === "loading") {
      return // Wait for session to load
    }

    try {
      setLoading(true)
      setError(null)
      setAssessmentData(data)

      // Submit assessment to our API
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server error. Please try again.")
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit assessment")
      }

      // Check membership status
      const hasActiveMembership = result.membership?.hasActiveMembership || false
      const membershipStatus = result.membership?.status || "INACTIVE"

      // If user doesn't have active membership, redirect to pricing
      if (!hasActiveMembership && membershipStatus === "INACTIVE") {
        // Store assessment data for after membership activation
        sessionStorage.setItem("assessmentData", JSON.stringify(data))
        
        // Check if user has used free trial
        const user = session?.user as any
        if (user?.hasUsedFreeTrial) {
          // User needs to subscribe
          router.push(`/pricing?profileId=${result.profileId}&assessment=completed`)
        } else {
          // User can start free trial
          router.push(`/pricing?profileId=${result.profileId}&assessment=completed&trial=available`)
        }
        return
      }

      // User has active membership or trial - show loading immediately and generate plan
      setShowLoading(true)
      setError(null)
      // Submit assessment to Make.com (already done, but ensure webhook is triggered)
      // Start polling immediately - don't await, let it run in background
      pollForPlan(result.profileId)

    } catch (err: any) {
      console.error("Assessment submit error:", err)
      
      // Handle JSON parse errors
      if (err.message?.includes("JSON") || err.message?.includes("Unexpected token")) {
        setError("Server error. Please make sure you're logged in and try again.")
      } else {
        setError(err.message || "Failed to submit assessment. Please try again.")
      }
      setLoading(false)
    }
  }

  // Show personalized loading screen
  if (showLoading && assessmentData) {
    return (
      <PersonalizedLoading
        assessmentData={assessmentData}
        planReady={!!planId}
        onComplete={() => {
          if (planId) {
            // Redirect to plan page
            window.location.href = `/plans/${planId}`
          } else {
            // Fallback to account page if no plan ID
            window.location.href = "/account?tab=plans"
          }
        }}
      />
    )
  }

  return (
    <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 min-h-screen">
        {/* Nature-inspired wellness background layers */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Base gradient - lighter nature tones */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(24, 194, 96, 0.15) 0%, rgba(24, 194, 96, 0.05) 25%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 30%, transparent 55%),
                radial-gradient(circle at 50% 50%, rgba(230, 247, 236, 0.08) 0%, transparent 40%),
                linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.3) 50%, rgba(15, 23, 42, 0.95) 100%)
              `
            }}
          />
          {/* Soft light rays for wellness feel */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                linear-gradient(180deg, transparent 0%, rgba(24, 194, 96, 0.03) 20%, transparent 40%),
                linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.02) 30%, transparent 60%)
              `
            }}
          />
        </div>
        {/* Shooting Stars - must be above gradient */}
        <ShootingStars />
        <StarsBackground />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-32 lg:pt-40">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-medium md:text-5xl text-white mb-4">
              Your Personal <span className="text-[#18c260] relative inline-block" style={{
                background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s ease-in-out infinite'
              }}>AI Nutritionist</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/80">
              No more guessing. No more random diets.
              Just a weekly plan built exactly for your body, your schedule, and your goals, so you finally stay consistent and see real results.
            </p>

            <div className="mt-8">
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-4 flex items-center justify-center gap-2 text-white/80">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting your assessment...</span>
                </div>
              )}
              {/* Assessment Form */}
              <AssessmentForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <main className="overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </main>
    }>
      <AssessmentPageContent />
    </Suspense>
  )
}

