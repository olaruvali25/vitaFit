"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Calendar, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Plan {
  id: string
  title: string
  startDate: string
  endDate: string | null
  source: string
  profile: {
    id: string
    name: string
  }
}

interface Profile {
  id: string
  name: string
}

export function PlansTab() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [selectedProfileId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [profilesRes, plansRes] = await Promise.all([
        fetch("/api/profiles"),
        fetch(`/api/plans${selectedProfileId !== "all" ? `?profileId=${selectedProfileId}` : ""}`),
      ])

      if (profilesRes.ok) {
        const profilesData = await profilesRes.json()
        setProfiles(profilesData)
        // Don't auto-select first profile - let user choose "all" or specific profile
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        console.log("Fetched plans:", plansData) // Debug log
        setPlans(Array.isArray(plansData) ? plansData : [])
        setError(null)
      } else {
        const errorText = await plansRes.text()
        console.error("Failed to fetch plans:", plansRes.status, errorText)
        setError(`Failed to load plans: ${plansRes.status}`)
        setPlans([])
      }
    } catch (err: any) {
      console.error("Failed to fetch data:", err)
      setError(err?.message || "Failed to load plans")
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="text-center py-8 text-white">Loading plans...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">My Plans</h2>
          <p className="text-sm text-white/70 mt-1">
            View and manage your meal plans
          </p>
        </div>
        {profiles.length > 0 && (
          <Select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-48"
          >
            <option value="all">All Profiles</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-white/70 mb-4" />
            <p className="text-white/70 mb-4">
              {selectedProfileId === "all" 
                ? "No plans found for any profile." 
                : "No plans found for this profile."}
            </p>
            <Button asChild>
              <Link href="/assessment">Create Your First Plan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">{plan.title}</CardTitle>
                    <CardDescription className="mt-1 text-white/70">
                      {plan.profile?.name || "Unknown Profile"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(plan.startDate)}
                    {plan.endDate && ` - ${formatDate(plan.endDate)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/plans/${plan.id}`}>
                      View Plan
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

