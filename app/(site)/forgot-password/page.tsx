"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LogoIcon } from "@/components/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset email")
      } else {
        setMessage(data.message || "If an account exists, a password reset link has been sent")
        if (process.env.NODE_ENV === "development" && data.resetLink) {
          setMessage(`${data.message}. Reset link: ${data.resetLink}`)
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-xl border border-white/30 m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="bg-white/5 -m-px rounded-2xl border border-white/20 p-8 pb-6">
          <div>
            <Link
              href="/"
              aria-label="go home"
              className="inline-block mb-4"
            >
              <LogoIcon className="text-emerald-400" />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold text-white">Recover Password</h1>
            <p className="text-sm text-white/70">Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <div className="mt-6 space-y-6">
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
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">We'll send you a link to reset your password.</p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-white/70 text-center text-sm">
            Remembered your password?{" "}
            <Button
              asChild
              variant="link"
              className="px-2 text-emerald-400 hover:text-emerald-300"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
