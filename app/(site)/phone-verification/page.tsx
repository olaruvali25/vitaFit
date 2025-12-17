"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoIcon } from "@/components/logo"

export default function PhoneVerificationPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingSignup, setPendingSignup] = useState<any>(null)

  useEffect(() => {
    // Load pending signup data
    const signupData = sessionStorage.getItem("pendingSignup")
    if (!signupData) {
      // No pending signup, redirect to signup
      router.push("/signup")
      return
    }

    try {
      const data = JSON.parse(signupData)
      setPendingSignup(data)
    } catch (err) {
      console.error("Error parsing pending signup data:", err)
      router.push("/signup")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code")
      return
    }

    if (!pendingSignup) {
      setError("No pending signup found. Please start over.")
      return
    }

    setLoading(true)

    try {
      console.log("[Phone Verification] Verifying OTP for phone:", pendingSignup.phone)

      const response = await fetch("/api/supabase-auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: pendingSignup.phone,
          token: otp
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[Phone Verification] API error:", data)
        setError(data.error || "Verification failed")
        setLoading(false)
        return
      }

      console.log("[Phone Verification] Success! Account fully activated")

      // Clear pending signup data
      sessionStorage.removeItem("pendingSignup")

      // Account is now fully verified and profile created
      // Redirect to account or handle post-signup flow
      alert("Phone verified successfully! Your account is now active.")

      // Check if there's assessment data to submit
      if (pendingSignup.assessmentData && pendingSignup.redirectTo === "assessment") {
        try {
          const assessmentData = JSON.parse(pendingSignup.assessmentData)
          // Submit assessment automatically
          const assessmentResponse = await fetch("/api/assessment/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assessmentData),
          })

          if (assessmentResponse.ok) {
            const assessmentResult = await assessmentResponse.json()
            sessionStorage.removeItem("assessmentData")

            // Check membership and redirect accordingly
            const hasActiveMembership = assessmentResult.membership?.hasActiveMembership || false
            const membershipStatus = assessmentResult.membership?.status || "INACTIVE"

            if (!hasActiveMembership && membershipStatus === "INACTIVE") {
              // Check if user can start free trial
              const userResponse = await fetch("/api/membership")
              if (userResponse.ok) {
                const membershipData = await userResponse.json()
                const hasUsedTrial = membershipData.hasUsedFreeTrial || false
                if (!hasUsedTrial) {
                  window.location.href = `/pricing?profileId=${assessmentResult.profileId}&assessment=completed&trial=available`
                } else {
                  window.location.href = `/pricing?profileId=${assessmentResult.profileId}&assessment=completed`
                }
              } else {
                window.location.href = `/pricing?profileId=${assessmentResult.profileId}&assessment=completed&trial=available`
              }
            } else {
              // User has active membership - redirect to assessment to show loading and generate plan
              window.location.href = `/assessment?profileId=${assessmentResult.profileId}&assessment=completed`
            }
          } else {
            // Assessment failed, but account is created
            window.location.href = "/account"
          }
        } catch (err) {
          console.error("Error submitting assessment after phone verification:", err)
          window.location.href = "/account"
        }
      } else {
        // No assessment data, redirect to account
        window.location.href = "/account"
      }

    } catch (err: any) {
      console.error("Phone verification error:", err)
      setError(err?.message || "Verification failed. Please try again.")
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!pendingSignup) return

    setError("")
    setLoading(true)

    try {
      // Resend signup request to trigger new SMS
      const response = await fetch("/api/supabase-auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingSignup.email,
          password: pendingSignup.password,
          phone: pendingSignup.phone
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Verification code sent! Please check your phone.")
      } else {
        setError(data.error || "Failed to resend code")
      }
    } catch (err: any) {
      console.error("Resend code error:", err)
      setError("Failed to resend verification code")
    }

    setLoading(false)
  }

  if (!pendingSignup) {
    return (
      <section className="flex min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 px-4 py-16 md:py-32">
        <div className="max-w-md m-auto w-full text-center text-white">
          <LogoIcon className="mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-white/20 m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="bg-white/5 -m-px rounded-2xl border border-white/20 p-8 pb-6">
          <div className="text-center">
            <LogoIcon className="text-emerald-400 mx-auto mb-4" />
            <h1 className="mb-1 mt-4 text-xl font-semibold text-white">Verify Your Phone</h1>
            <p className="text-sm text-white/70">
              We sent a 6-digit code to {pendingSignup.phone}
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="block text-sm text-white/90 font-medium"
              >
                Verification Code
              </Label>
              <Input
                type="text"
                required
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => {
                  // Only allow digits, max 6
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setOtp(digitsOnly)
                }}
                placeholder="123456"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-white/50 mt-1 text-center">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Phone"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-emerald-400 hover:text-emerald-300 text-sm underline disabled:opacity-50"
            >
              Didn't receive code? Resend
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("pendingSignup")
                router.push("/signup")
              }}
              className="text-white/50 hover:text-white/70 text-sm underline"
            >
              Start Over
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
