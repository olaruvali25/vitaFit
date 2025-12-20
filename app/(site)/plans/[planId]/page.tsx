"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlanDayView } from "@/components/plans/PlanDayView"
import { Loader2 } from "lucide-react"

interface Plan {
  id: string
  profileId: string
  title: string
  startDate: string
  endDate: string | null
  caloriesTarget: number | null
  proteinTargetG: number | null
  fatTargetG: number | null
  carbTargetG: number | null
  workoutsPerWeek: number | null
  days: Array<{
    id: string
    dayNumber: number
    date: string
    waterTargetGlasses: number
      meals: Array<{
      id: string
      mealType: string
      mealOrder: number
      recipeId: string
      recipeName: string
      imageUrl: string | null
      description: string | null
      calories: number
      proteinG: number
      fatG: number
      carbG: number
      ingredients: any[]
      isCompleted: boolean
      isSkipped: boolean
    }>
    progress: {
      waterGlassesDrunk: number
      workoutCompleted: boolean
    } | null
  }>
  profile: {
    id: string
    name: string
  }
}

export default function PlanPage() {
  const { user, loading: authLoading } = useSupabase()
  const status = authLoading ? "loading" : user ? "authenticated" : "unauthenticated"
  const params = useParams()
  const router = useRouter()
  const planId = params.planId as string

  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && planId) {
      fetchPlan()
    }
  }, [status, planId, router])

  const fetchPlan = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/plans/${planId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch plan")
      }
      const data = await response.json()
      setPlan(data)
      if (data.days && data.days.length > 0) {
        setSelectedDay(data.days[0].dayNumber)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load plan")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container px-4 py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 min-h-screen">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Card className="p-8 text-center bg-white/60 backdrop-blur-xl border-white/30">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Plan Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The plan you're looking for doesn't exist."}</p>
            <Button onClick={() => router.push("/account")}>Back to Account</Button>
          </Card>
        </div>
      </div>
    )
  }

  const selectedDayData = plan.days.find((d) => d.dayNumber === selectedDay)
  const dailyCalories = selectedDayData?.meals.reduce((sum, meal) => sum + meal.calories, 0) || 0
  const dailyProtein = selectedDayData?.meals.reduce((sum, meal) => sum + meal.proteinG, 0) || 0

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/account")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← Back to Account
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Welcome, {plan.profile.name}!
          </h1>
          <p className="text-gray-600">{plan.title}</p>
        </div>

        {/* Daily Targets Cards */}
        {plan.caloriesTarget && plan.proteinTargetG && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-6 bg-white/60 backdrop-blur-xl border-emerald-200/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Daily Calories</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(dailyCalories)} / {Math.round(plan.caloriesTarget)}
                  </p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </Card>
            <Card className="p-6 bg-white/60 backdrop-blur-xl border-emerald-200/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Daily Protein</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(dailyProtein)}g / {Math.round(plan.proteinTargetG)}g
                  </p>
                </div>
                <div className="text-4xl">💪</div>
              </div>
            </Card>
          </div>
        )}

        {/* Day Tabs */}
        <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(Number(v))}>
          <TabsList className="grid w-full grid-cols-7 mb-6">
            {plan.days.map((day) => (
              <TabsTrigger key={day.id} value={day.dayNumber.toString()}>
                Day {day.dayNumber}
              </TabsTrigger>
            ))}
          </TabsList>

          {plan.days.map((day) => (
            <TabsContent key={day.id} value={day.dayNumber.toString()}>
              <PlanDayView
                planId={plan.id}
                day={day}
                targets={{
                  calories: plan.caloriesTarget || 0,
                  protein: plan.proteinTargetG || 0,
                  fat: plan.fatTargetG || 0,
                  carbs: plan.carbTargetG || 0,
                }}
                onUpdate={fetchPlan}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

