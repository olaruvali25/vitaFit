"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LogoIcon } from "@/components/logo"

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Load assessment data from sessionStorage if exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const assessmentData = sessionStorage.getItem("assessmentData")
      if (assessmentData) {
        try {
          const data = JSON.parse(assessmentData)
          if (data.fullName) {
            const names = data.fullName.split(" ")
            setFirstName(names[0] || "")
            setLastName(names.slice(1).join(" ") || "")
          }
          if (data.email) {
            setEmail(data.email)
          }
        } catch (e) {
          console.error("Error parsing assessment data:", e)
        }
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const name = `${firstName} ${lastName}`.trim()
      const normalizedEmail = email.trim().toLowerCase()
      console.log("[Signup] Attempting to create account with email:", normalizedEmail)
      
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: normalizedEmail, password }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response from signup:", text)
        setError("Server error. Please try again.")
        setLoading(false)
        return
      }

      const data = await response.json()

      if (!response.ok) {
        console.error("[Signup] API error:", data)
        console.error("[Signup] Response status:", response.status)
        
        // Handle specific error cases
        if (response.status === 401) {
          setError("Authentication error. Please try again or contact support.")
        } else if (response.status === 400 && data.error) {
          setError(data.error)
        } else {
          setError(data.error || `Failed to create account (Status: ${response.status})`)
        }
        setLoading(false)
        return
      }

      // Auto sign in after signup (use normalized email)
      console.log("Attempting to sign in...")
      try {
        const result = await signIn("credentials", {
          email: normalizedEmail,
          password,
          redirect: false,
          callbackUrl: "/account",
        })

        console.log("Sign in result:", result)

        if (result?.error) {
          console.error("Sign in error:", result.error)
          // Account created but auto-login failed - redirect to login
          alert(`Account created successfully! Please log in with your email and password.`)
          window.location.href = "/login"
          return
        }

        if (result?.ok) {
          // Successfully signed in
          console.log("Sign in successful, redirecting...")
          // Force refresh session
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if there's assessment data to submit
          const assessmentData = sessionStorage.getItem("assessmentData")
          if (assessmentData && redirectTo === "assessment") {
            try {
              const data = JSON.parse(assessmentData)
              // Submit assessment automatically
              const assessmentResponse = await fetch("/api/assessment/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              })

              if (assessmentResponse.ok) {
                const assessmentResult = await assessmentResponse.json()
                sessionStorage.removeItem("assessmentData")
                
                // Check membership and redirect accordingly
                const hasActiveMembership = assessmentResult.membership?.hasActiveMembership || false
                const membershipStatus = assessmentResult.membership?.status || "INACTIVE"
                
                if (!hasActiveMembership && membershipStatus === "INACTIVE") {
                  // Store assessment data for after membership activation
                  sessionStorage.setItem("assessmentData", JSON.stringify(data))
                  
                  // Check if user can start free trial
                  const userResponse = await fetch("/api/membership")
                  if (userResponse.ok) {
                    const membershipData = await userResponse.json()
                    // Check if user has used free trial from the response
                    const hasUsedTrial = membershipData.hasUsedFreeTrial || false
                    if (!hasUsedTrial) {
                      window.location.href = `/pricing?profileId=${assessmentResult.profileId}&assessment=completed&trial=available`
                    } else {
                      window.location.href = `/pricing?profileId=${assessmentResult.profileId}&assessment=completed`
                    }
                  } else {
                    // Default to trial available if we can't check
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
              console.error("Error submitting assessment after signup:", err)
              window.location.href = "/account"
            }
          } else {
            // No assessment data, normal redirect - use window.location for hard refresh
            window.location.href = "/account"
          }
        } else {
          // Unexpected result
          alert("Account created successfully! Please log in.")
          window.location.href = "/login"
          setLoading(false)
        }
      } catch (signInError: any) {
        console.error("Sign in error:", signInError)
        alert("Account created successfully! Please log in with your email and password.")
        window.location.href = "/login"
        setLoading(false)
      }
    } catch (err: any) {
      console.error("Signup form error:", err)
      setError(err?.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // Google OAuth will be implemented later
    alert("Google sign-in will be available soon")
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-white/20 m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="bg-white/5 -m-px rounded-2xl border border-white/20 p-8 pb-6">
          <div className="text-center">
            <Link
              href="/"
              aria-label="go home"
              className="mx-auto block w-fit mb-4"
            >
              <LogoIcon className="text-emerald-400" />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold text-white">Create a VitaFit Account</h1>
            <p className="text-sm text-white/70">Welcome! Create an account to get started</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="firstname"
                  className="block text-sm text-white/90 font-medium"
                >
                  Firstname
                </Label>
                <Input
                  type="text"
                  required
                  name="firstname"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastname"
                  className="block text-sm text-white/90 font-medium"
                >
                  Lastname
                </Label>
                <Input
                  type="text"
                  required
                  name="lastname"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm text-white/90 font-medium"
              >
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm text-white/90 font-medium"
              >
                Password
              </Label>
              <Input
                type="password"
                required
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                minLength={8}
              />
              <p className="text-xs text-white/50 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="block text-sm text-white/90 font-medium"
              >
                Confirm Password
              </Label>
              <Input
                type="password"
                required
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed border-white/20" />
            <span className="text-white/50 text-xs">Or continue With</span>
            <hr className="border-dashed border-white/20" />
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={handleGoogleSignIn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
                className="mr-2"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-white/70 text-center text-sm">
            Have an account?{" "}
            <Button
              asChild
              variant="link"
              className="px-2 text-emerald-400 hover:text-emerald-300"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <section className="flex min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 px-4 py-16 md:py-32">
        <div className="max-w-md m-auto w-full text-center text-white">
          <LogoIcon className="mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </section>
    }>
      <SignupPageContent />
    </Suspense>
  )
}
