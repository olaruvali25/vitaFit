"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function MealPlanLoadingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [statusText, setStatusText] = useState("Personalization takes a bit of care, we’re on it!")
  const [name, setName] = useState<string>("")
  const profileId = searchParams.get("profileId")
  const assessmentCompleted = searchParams.get("assessment") === "completed"
  const checkedRef = useRef(false)

  // Simple poller for generated plans
  const pollForPlan = async (targetProfileId: string, maxAttempts = 180) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((res) => setTimeout(res, 2000))
      try {
        const res = await fetch(`/api/plans?profileId=${targetProfileId}`)
        if (res.ok) {
          const plans = await res.json()
          if (Array.isArray(plans) && plans.length > 0) {
            // Pick latest
            const latest = plans.sort(
              (a: any, b: any) =>
                new Date(b.createdAt || b.startDate).getTime() -
                new Date(a.createdAt || a.startDate).getTime()
            )[0]
            if (latest) {
              router.push(`/plans/${latest.id}`)
              return
            }
          }
        }
      } catch (err) {
        console.error("Plan polling error:", err)
      }
    }
    setError("Plan generation is taking longer than expected. Please refresh or check back shortly.")
  }

  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    const run = async () => {
      if (!profileId) {
        setError("Missing profile. Please redo the assessment.")
        return
      }

      // Pull name from stored assessment data (if available)
      try {
        const stored = sessionStorage.getItem("assessmentData")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.fullName) {
            const first = (parsed.fullName as string).split(" ").filter(Boolean)[0]
            setName(first || parsed.fullName)
          }
        }
      } catch (e) {
        console.error("Could not parse assessmentData for name", e)
      }

      try {
        const membershipRes = await fetch("/api/membership")
        if (!membershipRes.ok) {
          setError("Unable to verify membership.")
          return
        }
        const membership = await membershipRes.json()
        const hasPlan =
          membership?.status === "ACTIVE" ||
          membership?.status === "TRIAL" ||
          membership?.canUseFeatures === true

        if (!hasPlan) {
          setStatusText("Redirecting to pricing to activate a plan...")
          router.push(`/pricing?profileId=${profileId}&assessment=completed&next=/meal-plan/loading`)
          return
        }

        // Ready to poll for plan
        await pollForPlan(profileId)
      } catch (err: any) {
        console.error("Loading page error:", err)
        setError("Unexpected error. Please try again.")
      }
    }

    run()
  }, [router, profileId, assessmentCompleted])

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        {/* Layered modern loader */}
        <div className="relative flex justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl animate-pulse" />
          <div className="absolute h-16 w-16 rounded-full bg-emerald-400/15 blur-xl animate-[pulse_2s_ease-in-out_infinite_400ms]" />
          <div className="relative h-14 w-14 rounded-full border-4 border-emerald-400/70 border-t-transparent animate-spin" />
        </div>
        <h1 className="text-2xl font-semibold">
          This is where your progress begins{ name ? `, ${name}!` : "!"}
        </h1>
        <p className="text-sm text-gray-600">{statusText}</p>
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
        {!error && (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            <span>Customizing every day around your goal </span>
          </div>
        )}
      </div>
    </main>
  )
}

export default function MealPlanLoadingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 text-gray-900 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          <span>Loading...</span>
        </div>
      </main>
    }>
      <MealPlanLoadingContent />
    </Suspense>
  )
}

