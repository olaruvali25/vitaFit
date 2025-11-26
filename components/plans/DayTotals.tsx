"use client"

import { Card } from "@/components/ui/card"

interface DayTotalsProps {
  totals: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  targets: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
}

export function DayTotals({ totals, targets }: DayTotalsProps) {
  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 90 && percentage <= 110) return "text-[#18c260]"
    if (percentage >= 70 && percentage < 90) return "text-yellow-500"
    if (percentage > 110) return "text-orange-500"
    return "text-red-500"
  }

  const macros = [
    { label: "Calories", current: totals.calories, target: targets.calories, unit: "kcal" },
    { label: "Protein", current: totals.protein, target: targets.protein, unit: "g" },
    { label: "Carbs", current: totals.carbs, target: targets.carbs, unit: "g" },
    { label: "Fats", current: totals.fat, target: targets.fat, unit: "g" },
  ]

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-white">Day Totals</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {macros.map((macro) => {
          const percentage = (macro.current / macro.target) * 100
          const color = getProgressColor(macro.current, macro.target)

          return (
            <div key={macro.label} className="text-center">
              <p className="text-sm text-white/70 mb-1">{macro.label}</p>
              <p className={`text-2xl font-bold ${color}`}>
                {Math.round(macro.current)}
              </p>
              <p className="text-xs text-white/70">
                / {Math.round(macro.target)} {macro.unit}
              </p>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    percentage >= 90 && percentage <= 110
                      ? "bg-[#18c260]"
                      : percentage >= 70 && percentage < 90
                      ? "bg-yellow-500"
                      : percentage > 110
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

