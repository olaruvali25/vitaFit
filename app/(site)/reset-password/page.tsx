"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LogoIcon } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const supabaseRef = useRef(createSupabaseBrowserClient())

  // Check if we have a valid recovery session
  useEffect(() => {
    const supabase = supabaseRef.current
    
    const checkSession = async () => {
      // Supabase will automatically handle the recovery token from URL
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setIsValidSession(true)
      } else {
        // Check if we're in a recovery flow (URL has access_token or type=recovery)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const type = hashParams.get('type')
        
        if (accessToken && type === 'recovery') {
          // Let Supabase handle the session setup
          setIsValidSession(true)
        } else {
          setIsValidSession(false)
        }
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true)
      }
    })

    return () => subscription.unsubscribe()
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

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number")
      return
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError("Password must contain at least one special character")
      return
    }

    setLoading(true)

    try {
      const supabase = supabaseRef.current
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Password reset error:", err)
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (isValidSession === null) {
    return (
      <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
        <div className="max-w-md m-auto w-full text-center text-gray-900">
          <LogoIcon className="mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (isValidSession === false) {
    return (
      <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl p-8 text-center">
          <LogoIcon className="mx-auto mb-4 text-emerald-400" />
          <h1 className="text-xl font-semibold text-white mb-4">Invalid or Expired Link</h1>
          <p className="text-white/70 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            <Link href="/forgot-password">Request New Link</Link>
          </Button>
        </div>
      </section>
    )
  }

  if (success) {
    return (
      <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl p-8 text-center">
          <LogoIcon className="mx-auto mb-4 text-emerald-400" />
          <h1 className="text-xl font-semibold text-white mb-4">Password Reset Successful!</h1>
          <p className="text-white/70 mb-6">
            Your password has been updated. Redirecting you to login...
          </p>
          <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-xl border border-white/30 m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="bg-white/5 -m-px rounded-2xl border border-white/20 p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home" className="inline-block mb-4">
              <LogoIcon className="text-emerald-400" />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold text-white">Set New Password</h1>
            <p className="text-sm text-white/70">Enter your new password below</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm text-white/90 font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Must be at least 8 characters, contain a number and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="block text-sm text-white/90 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-white/70 text-center text-sm">
            Remembered your password?{" "}
            <Button asChild variant="link" className="px-2 text-emerald-400 hover:text-emerald-300">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
        <div className="max-w-md m-auto w-full text-center text-gray-900">
          <LogoIcon className="mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </section>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
