"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { useRouter, useSearchParams } from "next/navigation"
import AssessmentForm from "@/components/forms/AssessmentForm"
import type { AssessmentFormData } from "@/components/forms/AssessmentForm"
import { PersonalizedLoading } from "@/components/assessment/PersonalizedLoading"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"
import { Loader2 } from "lucide-react"

function AssessmentPageContent() {
  const { user, loading: authLoading } = useSupabase()
  const status = authLoading ? "loading" : user ? "authenticated" : "unauthenticated"
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [planId, setPlanId] = useState<string | null>(null)
  
  // Track if redirect is in progress to prevent double redirects
  const redirectingRef = useRef(false)

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
    // CRITICAL: Save data IMMEDIATELY, before ANYTHING else
    try {
      const dataString = JSON.stringify(data)
      sessionStorage.setItem("assessmentData", dataString)
      console.log("[Assessment] Data saved to sessionStorage:", dataString.substring(0, 100))
      
      // Verify it was saved
      const saved = sessionStorage.getItem("assessmentData")
      if (!saved) {
        console.error("[Assessment] CRITICAL: Data was not saved to sessionStorage!")
        alert("Error saving your data. Please try again.")
        return
      }
    } catch (err) {
      console.error("[Assessment] CRITICAL ERROR saving to sessionStorage:", err)
      alert("Error saving your data. Please try again.")
      return
    }

    // Check if user is authenticated - do this AFTER saving data
    if (status === "unauthenticated") {
      console.log("[Assessment] User not authenticated, redirecting to login")
      
      // Prevent double redirects
      if (redirectingRef.current) {
        console.log("[Assessment] Redirect already in progress, skipping")
        return
      }
      redirectingRef.current = true
      
      // IMMEDIATE redirect - use window.location.replace for hard redirect
      // This prevents back button and ensures clean redirect
      window.location.replace(`/login?redirect=assessment`)
      return
    }

    if (status === "loading") {
      console.log("[Assessment] Session loading, waiting...")
      // Wait for session to load, but data is already saved
      return
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

      // If user doesn't have active membership, redirect to pricing and preserve next
      if (!hasActiveMembership && membershipStatus === "INACTIVE") {
        sessionStorage.setItem("assessmentData", JSON.stringify(data))
        const userObj = user as any
        const trialQuery = userObj?.hasUsedFreeTrial ? "" : "&trial=available"
        router.push(
          `/pricing?profileId=${result.profileId}&assessment=completed&next=/meal-plan/loading${trialQuery}`
        )
        return
      }

      // User has active membership or trial - go to loading/generation page
      sessionStorage.setItem("assessmentData", JSON.stringify(data))
      setShowLoading(true)
      setError(null)
      router.push(`/meal-plan/loading?profileId=${result.profileId}&assessment=completed`)

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
    <main className="overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
      <section className="relative overflow-hidden min-h-screen scroll-mt-20">
        {/* Page-specific light background with green/teal gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 via-emerald-100/50 to-white/90" />
        {/* Green shadows at corners */}
        <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10" />
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/8 rounded-full blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-teal-700/8 rounded-full blur-3xl -z-10" />
        {/* Shooting Stars - removed as per previous instructions to remove them from assessment section */}
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-32 lg:pt-40">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-medium md:text-5xl text-gray-900 mb-4">
              Your Personal <span className="text-emerald-600 relative inline-block">AI Nutritionist</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-gray-700">
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
      <main className="overflow-hidden min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 via-emerald-100/60 via-green-100/40 to-green-950/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </main>
    }>
      <AssessmentPageContent />
    </Suspense>
  )
}

