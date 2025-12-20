"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LogoIcon } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      // Create browser client that properly syncs cookies with server
      const supabase = createSupabaseBrowserClient()
      
      console.log("[LOGIN] Starting login process...")

      // Step 1: Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (signInError) {
        console.error("[LOGIN] Sign in error:", signInError)
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      if (!data.session) {
        console.error("[LOGIN] No session returned")
        setError("Login failed - no session created")
        setLoading(false)
        return
      }

      console.log("[LOGIN] Sign in successful, session created")

      // Step 2: Force session confirmation
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("[LOGIN] Session confirmation error:", sessionError)
        setError("Login failed - session verification error")
        setLoading(false)
        return
      }

      if (!sessionData.session) {
        console.error("[LOGIN] Session confirmation failed - no active session")
        setError("Login failed - session not confirmed")
        setLoading(false)
        return
      }

      console.log("[LOGIN] Session confirmed, user authenticated:", sessionData.session.user.email)

      // Step 3: Explicit redirect to dashboard
      console.log("[LOGIN] Redirecting to /account...")
      router.replace("/account")

    } catch (err: any) {
      console.error("[LOGIN] Unexpected error:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const supabase = createSupabaseBrowserClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("[LOGIN] Google sign-in error:", error)
        setError("Google sign-in failed. Please try again.")
        setLoading(false)
      }
      // If successful, Supabase will redirect to Google
    } catch (err: any) {
      console.error("[LOGIN] Google sign-in error:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
      <div className="max-w-md m-auto h-fit w-full bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6">
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
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
              placeholder="Enter your email"
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button
            type="button"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={loading}
            onClick={handleLogin}
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
      </div>
    </section>
  )
}
