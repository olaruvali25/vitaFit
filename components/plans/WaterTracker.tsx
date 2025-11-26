"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"

interface WaterTrackerProps {
  planId: string
  dayId: string
  targetGlasses: number
  currentGlasses: number
  onUpdate: () => void
}

export function WaterTracker({
  planId,
  dayId,
  targetGlasses,
  currentGlasses,
  onUpdate,
}: WaterTrackerProps) {
  const [updating, setUpdating] = useState(false)

  const handleGlassClick = async (glasses: number) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/plans/${planId}/days/${dayId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waterGlassesDrunk: glasses }),
      })

      if (!response.ok) throw new Error("Failed to update water intake")
      onUpdate()
    } catch (error) {
      console.error("Error updating water intake:", error)
    } finally {
      setUpdating(false)
    }
  }

  const progress = (currentGlasses / targetGlasses) * 100
  const encouragement =
    currentGlasses >= targetGlasses
      ? "Great job! You've hit your goal! 🎉"
      : currentGlasses >= targetGlasses * 0.75
      ? "Almost there! Keep going! 💪"
      : currentGlasses >= targetGlasses * 0.5
      ? "Halfway there! You're doing great! 🌊"
      : "Stay hydrated! Every glass counts! 💧"

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1 text-white">Water Intake</h3>
          <p className="text-sm text-white/70">
            {currentGlasses} / {targetGlasses} glasses today
          </p>
        </div>
        <div className="text-2xl">💧</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#18c260] to-[#18c260]/80 transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Glass Icons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: targetGlasses }).map((_, index) => {
          const glassNumber = index + 1
          const isFilled = glassNumber <= currentGlasses

          return (
            <button
              key={index}
              onClick={() => handleGlassClick(glassNumber)}
              disabled={updating}
              className={`
                w-10 h-10 rounded-lg border-2 transition-all duration-200
                flex items-center justify-center
                ${
                  isFilled
                    ? "bg-[#18c260]/20 border-[#18c260] text-[#18c260]"
                    : "bg-white/5 border-white/20 text-white/40 hover:border-white/40"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Droplet className="w-5 h-5" fill={isFilled ? "currentColor" : "none"} />
            </button>
          )
        })}
      </div>

      {/* Encouragement Text */}
      <p className="text-sm text-center text-white/70">{encouragement}</p>
    </Card>
  )
}

