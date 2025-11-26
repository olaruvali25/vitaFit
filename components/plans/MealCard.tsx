"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Settings2 } from "lucide-react"
import Image from "next/image"

interface MealCardProps {
  planId: string
  dayId: string
  meal: {
    id: string
    mealType: string
    mealOrder: number
    recipeName: string
    imageUrl: string | null
    description: string | null
    calories: number
    proteinG: number
    fatG: number
    carbG: number
    isCompleted: boolean
    isSkipped: boolean
  }
  onUpdate: () => void
  onCustomize: () => void
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
}

export function MealCard({ planId, dayId, meal, onUpdate, onCustomize }: MealCardProps) {
  const [updating, setUpdating] = useState(false)

  const handleComplete = async () => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/plans/${planId}/days/${dayId}/meals/${meal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !meal.isCompleted }),
      })

      if (!response.ok) throw new Error("Failed to update meal")
      onUpdate()
    } catch (error) {
      console.error("Error updating meal:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleSkip = async () => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/plans/${planId}/days/${dayId}/meals/${meal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSkipped: !meal.isSkipped }),
      })

      if (!response.ok) throw new Error("Failed to update meal")
      onUpdate()
    } catch (error) {
      console.error("Error updating meal:", error)
    } finally {
      setUpdating(false)
    }
  }

  const mealTypeLabel = MEAL_TYPE_LABELS[meal.mealType] || meal.mealType

  return (
    <Card
      className={`p-6 bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-200 ${
        meal.isCompleted ? "opacity-75" : meal.isSkipped ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-6">
        {/* Meal Image */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.recipeName}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = "/images/meals/placeholder.jpg"
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🍽️
            </div>
          )}
        </div>

        {/* Meal Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {mealTypeLabel}
                </Badge>
                {meal.isCompleted && (
                  <Badge className="bg-[#18c260] text-white text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                )}
                {meal.isSkipped && (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Skipped
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-1 text-white">{meal.recipeName}</h3>
              {meal.description && (
                <p className="text-sm text-white/70 mb-3">{meal.description}</p>
              )}
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <p className="text-xs text-white/70 mb-1">Calories</p>
              <p className="text-sm font-semibold text-white">{Math.round(meal.calories)}</p>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <p className="text-xs text-white/70 mb-1">Protein</p>
              <p className="text-sm font-semibold text-white">{Math.round(meal.proteinG)}g</p>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <p className="text-xs text-white/70 mb-1">Carbs</p>
              <p className="text-sm font-semibold text-white">{Math.round(meal.carbG)}g</p>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <p className="text-xs text-white/70 mb-1">Fats</p>
              <p className="text-sm font-semibold text-white">{Math.round(meal.fatG)}g</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleComplete}
              disabled={updating || meal.isSkipped}
              variant={meal.isCompleted ? "outline" : "default"}
              size="sm"
              className={meal.isCompleted ? "border-[#18c260] text-[#18c260]" : ""}
            >
              {meal.isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Completed
                </>
              ) : (
                "Mark Complete"
              )}
            </Button>
            <Button
              onClick={handleSkip}
              disabled={updating || meal.isCompleted}
              variant={meal.isSkipped ? "outline" : "ghost"}
              size="sm"
              className={meal.isSkipped ? "border-red-500 text-red-500" : ""}
            >
              {meal.isSkipped ? "Unskip" : "Skip Meal"}
            </Button>
            <Button
              onClick={onCustomize}
              variant="ghost"
              size="sm"
              className="ml-auto"
            >
              <Settings2 className="w-4 h-4 mr-1" />
              Customize
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

