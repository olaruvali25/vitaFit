"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WaterTracker } from "./WaterTracker"
import { WorkoutTracker } from "./WorkoutTracker"
import { MealCard } from "./MealCard"
import { DayTotals } from "./DayTotals"
import { MealCustomizeModal } from "./MealCustomizeModal"
import { Badge } from "@/components/ui/badge"

interface PlanDayViewProps {
  planId: string
  day: {
    id: string
    dayNumber: number
    date: string
    waterTargetGlasses: number
    meals: Array<{
      id: string
      mealType: string
      mealOrder: number
      recipeId?: string
      recipeName: string
      imageUrl: string | null
      description: string | null
      calories: number
      proteinG: number
      fatG: number
      carbG: number
      ingredients?: any[]
      isCompleted: boolean
      isSkipped: boolean
    }>
    progress: {
      waterGlassesDrunk: number
      workoutCompleted: boolean
    } | null
  }
  targets: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  onUpdate: () => void
}

export function PlanDayView({ planId, day, targets, onUpdate }: PlanDayViewProps) {
  const [customizingMealId, setCustomizingMealId] = useState<string | null>(null)

  const dayTotals = day.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.proteinG,
      fat: acc.fat + meal.fatG,
      carbs: acc.carbs + meal.carbG,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Day {day.dayNumber}</h2>
          <p className="text-white/70">{formatDate(day.date)}</p>
        </div>
      </div>

      {/* Water Tracker */}
      <WaterTracker
        planId={planId}
        dayId={day.id}
        targetGlasses={day.waterTargetGlasses}
        currentGlasses={day.progress?.waterGlassesDrunk || 0}
        onUpdate={onUpdate}
      />

      {/* Day Totals */}
      <DayTotals totals={dayTotals} targets={targets} />

      {/* Workout Tracker */}
      {day.dayNumber <= 7 && (
        <WorkoutTracker
          planId={planId}
          dayId={day.id}
          completed={day.progress?.workoutCompleted || false}
          onUpdate={onUpdate}
        />
      )}

      {/* Meals List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Today's Meals</h3>
        {day.meals.map((meal) => (
          <MealCard
            key={meal.id}
            planId={planId}
            dayId={day.id}
            meal={meal}
            onUpdate={onUpdate}
            onCustomize={() => setCustomizingMealId(meal.id)}
          />
        ))}
      </div>

      {/* Meal Customization Modal */}
      {customizingMealId && (() => {
        const meal = day.meals.find((m) => m.id === customizingMealId)
        if (!meal) return null
        
        // Fetch full meal data including ingredients
        return (
          <MealCustomizeModal
            planId={planId}
            dayId={day.id}
            mealId={customizingMealId}
            meal={{
              id: meal.id,
              mealType: meal.mealType,
              recipeId: (meal as any).recipeId || "",
              recipeName: meal.recipeName,
              calories: meal.calories,
              proteinG: meal.proteinG,
              fatG: meal.fatG,
              carbG: meal.carbG,
              ingredients: (meal as any).ingredients || [],
            }}
            onClose={() => setCustomizingMealId(null)}
            onUpdate={onUpdate}
          />
        )
      })()}
    </div>
  )
}

