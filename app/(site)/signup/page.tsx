"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import Link from "next/link"
import { LogoIcon } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneCountry, setPhoneCountry] = useState("+1") // Default to United States
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Country data with prefixes, ISO codes, and digit limits
  const countries = [
    { country: "Argentina", iso: "AR", prefix: "+54", digits: 10 },
    { country: "Australia", iso: "AU", prefix: "+61", digits: 9 },
    { country: "Austria", iso: "AU", prefix: "+43", digits: 10 },
    { country: "Belgium", iso: "BE", prefix: "+32", digits: 9 },
    { country: "Brazil", iso: "BR", prefix: "+55", digits: 11 },
    { country: "Canada", iso: "CA", prefix: "+1", digits: 10 },
    { country: "Chile", iso: "CL", prefix: "+56", digits: 9 },
    { country: "Colombia", iso: "CO", prefix: "+57", digits: 10 },
    { country: "Czech Republic", iso: "CZ", prefix: "+420", digits: 9 },
    { country: "Denmark", iso: "DK", prefix: "+45", digits: 8 },
    { country: "Finland", iso: "FI", prefix: "+358", digits: 9 },
    { country: "France", iso: "FR", prefix: "+33", digits: 9 },
    { country: "Germany", iso: "DE", prefix: "+49", digits: 11 },
    { country: "Greece", iso: "GR", prefix: "+30", digits: 10 },
    { country: "Hong Kong", iso: "HK", prefix: "+852", digits: 8 },
    { country: "Hungary", iso: "HU", prefix: "+36", digits: 9 },
    { country: "India", iso: "IN", prefix: "+91", digits: 10 },
    { country: "Indonesia", iso: "ID", prefix: "+62", digits: 10 },
    { country: "Ireland", iso: "IR", prefix: "+353", digits: 9 },
    { country: "Israel", iso: "IL", prefix: "+972", digits: 9 },
    { country: "Italy", iso: "IT", prefix: "+39", digits: 10 },
    { country: "Japan", iso: "JP", prefix: "+81", digits: 11 },
    { country: "Mexico", iso: "MX", prefix: "+52", digits: 10 },
    { country: "Netherlands", iso: "NL", prefix: "+31", digits: 9 },
    { country: "New Zealand", iso: "NZ", prefix: "+64", digits: 9 },
    { country: "Norway", iso: "NO", prefix: "+47", digits: 8 },
    { country: "Poland", iso: "PL", prefix: "+48", digits: 9 },
    { country: "Portugal", iso: "PT", prefix: "+351", digits: 9 },
    { country: "Romania", iso: "RO", prefix: "+40", digits: 9 },
    { country: "Saudi Arabia", iso: "SA", prefix: "+966", digits: 9 },
    { country: "Singapore", iso: "SG", prefix: "+65", digits: 8 },
    { country: "South Korea", iso: "KR", prefix: "+82", digits: 10 },
    { country: "Spain", iso: "ES", prefix: "+34", digits: 9 },
    { country: "Sweden", iso: "SW", prefix: "+46", digits: 9 },
    { country: "Switzerland", iso: "SZ", prefix: "+41", digits: 9 },
    { country: "Thailand", iso: "TH", prefix: "+66", digits: 9 },
    { country: "United Arab Emirates", iso: "AE", prefix: "+971", digits: 9 },
    { country: "United Kingdom", iso: "UK", prefix: "+44", digits: 10 },
    { country: "United States", iso: "US", prefix: "+1", digits: 10 }
  ]

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

    // Validate passwords
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
      setError("Password must contain at least one special character (!@#$%^&* etc.)")
      return
    }

    // Validate phone number
    const selectedCountry = countries.find(c => c.prefix === phoneCountry)
    if (!selectedCountry) {
      setError("Please select a valid country")
      return
    }

    if (!phoneNumber || phoneNumber.length !== selectedCountry.digits) {
      setError(`Phone number must be exactly ${selectedCountry.digits} digits for ${selectedCountry.country}`)
      return
    }

    // Only allow digits
    if (!/^\d+$/.test(phoneNumber)) {
      setError("Phone number must contain only digits")
      return
    }

    setLoading(true)

    try {
      const name = `${firstName} ${lastName}`.trim()
      const normalizedEmail = email.trim().toLowerCase()
      const fullPhone = `${phoneCountry}${phoneNumber}`

      console.log("[Signup] Attempting to create account with email:", normalizedEmail, "phone:", fullPhone)

      // Use Supabase auth endpoint
      const response = await fetch("/api/supabase-auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          phone: fullPhone
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[Signup] API error:", data)
        console.error("[Signup] Response status:", response.status)

        // Handle specific error cases
        if (response.status === 400 && data.error) {
          setError(data.error)
        } else {
          setError(data.error || `Failed to create account (Status: ${response.status})`)
        }
        setLoading(false)
        return
      }

      // TEMPORARILY DISABLED: Phone verification redirect for testing
      console.log("[Signup] Account creation successful - phone verification DISABLED for testing")

      // Success message
      alert("Account created successfully! You can now log in.")

      // Redirect to login page
      window.location.href = "/login"
      return
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
                  First Name
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
                  Last Name
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
                E-mail
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
                htmlFor="phone"
                className="block text-sm text-white/90 font-medium"
              >
                Phone Number (Required for SMS Verification)
              </Label>
              <div className="flex gap-2">
                <Select
                  value={phoneCountry}
                  onChange={(e) => setPhoneCountry(e.target.value)}
                  className="w-40 bg-white/5 border-white/20 text-white focus:border-emerald-400"
                >
                  {countries.map((country) => (
                    <option
                      key={`${country.prefix}-${country.iso}`}
                      value={country.prefix}
                      className="bg-slate-800 text-white"
                    >
                      {country.iso} {country.prefix}
                    </option>
                  ))}
                </Select>
                <Input
                  type="tel"
                  required
                  name="phone"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow digits and limit to country requirements
                    const digitsOnly = e.target.value.replace(/\D/g, '')
                    const selectedCountry = countries.find(c => c.prefix === phoneCountry)
                    if (selectedCountry && digitsOnly.length <= selectedCountry.digits) {
                      setPhoneNumber(digitsOnly)
                    }
                  }}
                  placeholder=""
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                  maxLength={countries.find(c => c.prefix === phoneCountry)?.digits || 15}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm text-white/90 font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
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
              <Label
                htmlFor="confirmPassword"
                className="block text-sm text-white/90 font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  name="confirmPassword"
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
