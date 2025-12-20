"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  title: string
  startDate: string
  endDate: string | null
  createdAt: string
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    if (selectedProfileId) {
      fetchPlans(selectedProfileId)
    } else {
      // Get profile ID from URL or select first profile
      const profileIdFromUrl = searchParams.get("profileId")
      if (profileIdFromUrl) {
        setSelectedProfileId(profileIdFromUrl)
      } else if (profiles.length > 0) {
        // Auto-select first profile if none selected
        setSelectedProfileId(profiles[0].id)
      }
    }
  }, [selectedProfileId, profiles, searchParams])

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data)
        // Auto-select first profile if none selected
        if (data.length > 0 && !selectedProfileId) {
          const profileIdFromUrl = searchParams.get("profileId")
          setSelectedProfileId(profileIdFromUrl || data[0].id)
        }
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err)
    }
  }

  const fetchPlans = async (profileId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/plans?profileId=${profileId}`)
      if (response.ok) {
        const data = await response.json()
        // Sort by creation date (newest first) to show Week 1, Week 2, etc.
        const sortedPlans = Array.isArray(data) 
          ? data.sort((a: Plan, b: Plan) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          : []
        setPlans(sortedPlans)
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const getWeekNumber = (index: number) => {
    return `Week ${index + 1}`
  }

  if (loading && !selectedProfileId) {
    return <div className="text-center py-8 text-gray-900">Loading...</div>
  }

  if (!selectedProfileId || profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No profiles found. Create a profile first.</p>
      </div>
    )
  }

  const selectedProfile = profiles.find(p => p.id === selectedProfileId)

  return (
    <div className="space-y-4">
      {/* Profile selector - show which profile's plans we're viewing */}
      {selectedProfile && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Viewing plans for:</p>
          <p className="text-lg font-semibold text-gray-900">{selectedProfile.name}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-900">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No meal plans found for this profile.</p>
          <Link 
            href="/assessment"
            className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Create Your First Plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="group relative bg-white/60 backdrop-blur-xl hover:bg-white border border-emerald-200/50 hover:border-emerald-500/50 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 shadow-sm"
            >
              {/* Week number badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {getWeekNumber(index)}
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {plan.title || getWeekNumber(index)}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(plan.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-emerald-600 group-hover:text-emerald-700 transition-colors font-medium">
                    Click to view full plan →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
