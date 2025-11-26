"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("admin@vitafit.com")
  const [password, setPassword] = useState("admin123")
  const [name, setName] = useState("Admin User")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleCreate = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create admin")
      } else {
        setResult(data)
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Create Admin Account</CardTitle>
          <CardDescription className="text-white/70">
            Create a developer admin account with unlimited access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-4 space-y-2">
              <p className="text-emerald-300 font-semibold">✅ Admin account created!</p>
              <div className="text-sm text-emerald-200 space-y-1">
                <p><strong>Email:</strong> {result.email}</p>
                <p><strong>Password:</strong> {result.password}</p>
                <p><strong>Role:</strong> {result.role}</p>
                {result.membership && <p><strong>Membership:</strong> {result.membership}</p>}
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-500/30">
                <p className="text-sm text-emerald-200 mb-2">You can now:</p>
                <ul className="text-sm text-emerald-200/80 list-disc list-inside space-y-1">
                  <li>Create unlimited profiles</li>
                  <li>Create unlimited plans per profile</li>
                  <li>Access all features without restrictions</li>
                </ul>
              </div>
            </div>
          )}

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </Button>

          <p className="text-xs text-white/50 text-center">
            Go to <a href="/login" className="text-emerald-400 hover:underline">/login</a> to sign in
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

