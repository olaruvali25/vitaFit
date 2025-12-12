"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Droplet, Target, Flame, Dumbbell, TrendingUp, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  weightKg: number | null
  goalWeight: number | null
  goal: string | null
}

interface Plan {
  id: string
  caloriesTarget: number | null
  workoutsPerWeek: number | null
  createdAt?: string
}

export function ProgressTracker() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [membership, setMembership] = useState<{ plan: string; status: string } | null>(null)

  useEffect(() => {
    fetchProgressData()
  }, [session])

  const fetchProgressData = async () => {
    try {
      const profilesRes = await fetch("/api/profiles")
      if (profilesRes.ok) {
        const profiles = await profilesRes.json()
        if (profiles.length > 0) {
          setProfile(profiles[0])
          const plansRes = await fetch(`/api/plans?profileId=${profiles[0].id}`)
          if (plansRes.ok) {
            const plans = await plansRes.json()
            if (plans.length > 0) {
              setPlan(plans[0])
            }
          }
        }
      }

      const membershipRes = await fetch("/api/membership")
      if (membershipRes.ok) {
        const membershipData = await membershipRes.json()
        setMembership({ plan: membershipData.plan, status: membershipData.status })
      }
    } catch (error) {
      console.error("Error fetching progress data:", error)
    }
  }

  // Always show tracker, even if no profile exists yet
  const userName = session?.user?.name || "User"
  const currentWeight = profile?.weightKg || 0
  const goalWeight = profile?.goalWeight || currentWeight || 0
  const dailyCalories = plan?.caloriesTarget || 0
  const workoutsPerWeek = plan?.workoutsPerWeek || 0
  const dailyWaterGlasses = 8
  
  // Calculate progress percentage
  let progressPercentage = 0
  if (currentWeight > 0 && goalWeight > 0) {
    if (goalWeight < currentWeight) {
      progressPercentage = 50
    } else if (goalWeight > currentWeight) {
      progressPercentage = Math.max(0, Math.min(100, (currentWeight / goalWeight) * 100))
    } else {
      progressPercentage = 100
    }
  }

  const stats = [
    {
      label: "Current Weight",
      value: currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : "Not set",
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Goal Weight",
      value: goalWeight > 0 ? `${goalWeight.toFixed(1)} kg` : "Not set",
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Daily Calories",
      value: dailyCalories > 0 ? `${Math.round(dailyCalories)} kcal` : "No plan yet",
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Daily Water",
      value: `${dailyWaterGlasses} glasses`,
      icon: Droplet,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Workouts/Week",
      value: workoutsPerWeek > 0 ? `${workoutsPerWeek} sessions` : "No plan yet",
      icon: Dumbbell,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="w-full min-h-[500px] relative z-10" style={{ display: 'block', visibility: 'visible' }}>
      <div className="bg-slate-900 border-4 border-emerald-500 rounded-xl backdrop-blur-xl shadow-2xl p-8 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            {userName}'s Personal Tracker
          </h2>
          <p className="text-white/60 text-sm">Your fitness journey at a glance</p>
        </div>

        {membership?.plan === "FREE_TRIAL" || membership?.status === "INACTIVE" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">Unlock Progress Tracker</p>
              <p className="text-sm text-white/70">
                Upgrade to Pro, Plus, or Family to access personalized tracking.
              </p>
            </div>
          </div>
        ) : (
        <>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Progress to Goal</span>
            <span className="text-sm font-semibold text-emerald-400">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
              style={{ width: `${Math.max(progressPercentage, 10)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border border-white/10",
                  stat.bgColor,
                  "transition-all hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        </>
        )}
      </div>
    </div>
  )
}
