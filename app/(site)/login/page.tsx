"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LogoIcon } from "@/components/logo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Normalize email (trim and lowercase) to match signup and auth
      const normalizedEmail = email.trim().toLowerCase()
      console.log("[Login] Attempting to sign in with email:", normalizedEmail)
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      })

      console.log("[Login] Sign in result:", { ok: result?.ok, error: result?.error })

      if (result?.error) {
        // Handle specific error messages
        console.error("[Login] Sign in error:", result.error)
        if (result.error === "CredentialsSignin" || result.error.includes("Credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else {
          setError(result.error || "Invalid email or password")
        }
        setLoading(false)
      } else if (result?.ok) {
        // Success - refresh session first
        await router.refresh()
        
        // Wait a moment for session to update
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check if there's assessment data to submit
        const assessmentData = sessionStorage.getItem("assessmentData")
        const redirectTo = new URLSearchParams(window.location.search).get("redirect")
        
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
              
              // Check membership and redirect accordingly
              const hasActiveMembership = assessmentResult.membership?.hasActiveMembership || false
              const membershipStatus = assessmentResult.membership?.status || "INACTIVE"
              
              if (!hasActiveMembership && membershipStatus === "INACTIVE") {
                // Keep assessment data for after membership activation
                window.location.href = `/pricing?profileId=${assessmentResult.profileId}&assessment=completed`
              } else {
                // User has membership, remove assessment data and go to account
                sessionStorage.removeItem("assessmentData")
                window.location.href = "/account?tab=plans"
              }
            } else {
              // Assessment failed, but logged in - keep data for retry
              const errorData = await assessmentResponse.json().catch(() => ({}))
              console.error("Assessment submit failed:", errorData)
              window.location.href = "/account"
            }
          } catch (err) {
            console.error("Error submitting assessment after login:", err)
            // Keep assessment data for retry
            window.location.href = "/account"
          }
        } else {
          // No assessment data, normal redirect
          window.location.href = "/account"
        }
      } else {
        setError("Something went wrong. Please try again.")
        setLoading(false)
      }
    } catch (err: any) {
      console.error("Login error:", err)
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
        className="max-w-md m-auto h-fit w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6"
      >
        <div>
          <Link
            href="/"
            aria-label="go home"
            className="inline-block mb-4"
          >
            <LogoIcon className="text-emerald-400" />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold text-white">Sign In to VitaFit</h1>
          <p className="text-white/70">Welcome back! Sign in to continue</p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
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

        <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <hr className="border-dashed border-white/20" />
          <span className="text-white/50 text-xs">Or continue With</span>
          <hr className="border-dashed border-white/20" />
        </div>

        <div className="space-y-6">
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm text-white/90 font-medium"
              >
                Password
              </Label>
              <Button
                asChild
                variant="link"
                size="sm"
                className="px-0 text-emerald-400 hover:text-emerald-300 h-auto text-xs"
              >
                <Link href="/forgot-password">Forgot password?</Link>
              </Button>
            </div>
            <Input
              type="password"
              required
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </div>

        <p className="text-white/70 text-center text-sm mt-6">
          Don't have an account?{" "}
          <Button
            asChild
            variant="link"
            className="px-2 text-emerald-400 hover:text-emerald-300"
          >
            <Link href="/signup">Create account</Link>
          </Button>
        </p>
      </form>
    </section>
  )
}
