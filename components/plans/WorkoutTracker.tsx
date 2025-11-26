"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"

interface WorkoutTrackerProps {
  planId: string
  dayId: string
  completed: boolean
  onUpdate: () => void
}

export function WorkoutTracker({ planId, dayId, completed, onUpdate }: WorkoutTrackerProps) {
  const [updating, setUpdating] = useState(false)

  const handleToggle = async () => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/plans/${planId}/days/${dayId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutCompleted: !completed }),
      })

      if (!response.ok) throw new Error("Failed to update workout status")
      onUpdate()
    } catch (error) {
      console.error("Error updating workout status:", error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            completed ? "bg-[#18c260]/20" : "bg-white/5"
          }`}>
            {completed ? (
              <CheckCircle2 className="w-6 h-6 text-[#18c260]" />
            ) : (
              <Circle className="w-6 h-6 text-white/40" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1 text-white">Workout Today</h3>
            <p className="text-sm text-white/70">
              {completed ? "Completed! Great work! 💪" : "30-45 minutes • Don't forget to warm up and cool down"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleToggle}
          disabled={updating}
          variant={completed ? "outline" : "default"}
          className={completed ? "border-[#18c260] text-[#18c260]" : ""}
        >
          {completed ? "Mark Incomplete" : "Mark Workout Complete"}
        </Button>
      </div>
    </Card>
  )
}

