"use client"

import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { AssessmentFormData } from "./AssessmentForm"
import ShimmerButton from "./ShimmerButton"

interface PageTwoProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
  onBack: () => void
  onSubmit: () => void
}

export default function PageTwo({
  formData,
  updateFormData,
  onBack,
  onSubmit,
}: PageTwoProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-1.5 text-white relative inline-block">
          Lifestyle & Preferences
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#18c260] opacity-60"></span>
        </h2>
        <p className="text-xs text-white/70 mt-1.5">
          Help us customize your plan
        </p>
        <div className="mt-2 h-px bg-white/10"></div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="space-y-4"
      >
        {/* Activity Level */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Activity Level <span className="text-[#18c260]">*</span>
          </Label>
          <div className="space-y-1.5">
            {[
              { value: "sedentary", label: "Sedentary" },
              { value: "lightly-active", label: "Lightly Active" },
              { value: "moderately-active", label: "Moderately Active" },
              { value: "active", label: "Active" },
              { value: "very-active", label: "Very Active" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 hover:border-green-400/50 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="activityLevel"
                  value={option.value}
                  checked={formData.activityLevel === option.value}
                  onChange={(e) =>
                    updateFormData({ activityLevel: e.target.value })
                  }
                  required
                  className="w-4 h-4 text-[#18c260] bg-white/5 border-white/40 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.2)] focus:outline-none cursor-pointer transition-all duration-300"
                />
                <span className="text-xs text-white/90">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label htmlFor="timeline" className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Timeline for goal <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="timeline"
            required
            value={formData.timeline}
            onChange={(e) => updateFormData({ timeline: e.target.value })}
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="">Select timeline</option>
            <option value="1-month">1 Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
            <option value="1-year">1 Year</option>
          </Select>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-1.5">
          <Label htmlFor="dietaryRestrictions" className="text-xs text-white/80">
            Dietary Restrictions <span className="text-white/50 text-xs">(optional)</span>
          </Label>
          <Textarea
            id="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={(e) =>
              updateFormData({ dietaryRestrictions: e.target.value })
            }
            rows={2}
            className="min-h-[60px] rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 resize-none"
            placeholder="e.g., No dairy, gluten-free, vegetarian..."
          />
        </div>

        {/* Workout Days per Week */}
        <div className="space-y-2">
          <Label htmlFor="workoutDays" className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Workout Days per Week <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="workoutDays"
            required
            value={formData.workoutDays}
            onChange={(e) =>
              updateFormData({ workoutDays: e.target.value })
            }
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="">Select days</option>
            <option value="2">2 days/week</option>
            <option value="3">3 days/week</option>
            <option value="4">4 days/week</option>
            <option value="5">5 days/week</option>
            <option value="6">6 days/week</option>
            <option value="7">7 days/week</option>
          </Select>
        </div>

        {/* Workout Duration */}
        <div className="space-y-2">
          <Label htmlFor="workoutDuration" className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Workout Duration <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="workoutDuration"
            required
            value={formData.workoutDuration}
            onChange={(e) =>
              updateFormData({ workoutDuration: e.target.value })
            }
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="">Select duration</option>
            <option value="30-45">30-45 mins</option>
            <option value="45-60">45-60 mins</option>
            <option value="60-90">60-90 mins</option>
            <option value="90+">90+ mins</option>
          </Select>
        </div>

        {/* Meal Prep Duration */}
        <div className="space-y-2">
          <Label htmlFor="mealPrepDuration" className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Meal Prep Cooking Time <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="mealPrepDuration"
            required
            value={formData.mealPrepDuration}
            onChange={(e) =>
              updateFormData({ mealPrepDuration: e.target.value })
            }
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="">Select duration</option>
            <option value="15-30">15-30 min</option>
            <option value="30-45">30-45 min</option>
            <option value="45-60">45-60 min</option>
            <option value="60+">60+ min</option>
          </Select>
        </div>

        {/* Back and Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <ShimmerButton
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto h-11 rounded-xl text-sm font-medium border-white/20 hover:bg-white/10 text-white"
          >
            Back
          </ShimmerButton>
          <ShimmerButton type="submit" className="flex-1 h-11 rounded-xl text-sm font-medium">
            Submit Assessment
          </ShimmerButton>
        </div>
      </form>
    </div>
  )
}

