"use client"

import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AssessmentFormData } from "./AssessmentForm"
import ShimmerButton from "./ShimmerButton"

interface PageTwoProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
  onBack: () => void
  onNext: () => void
}

const DIETARY_OPTIONS = [
  { value: "no-dairy", label: "No dairy" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "no-red-meat", label: "No red meat" },
  { value: "low-carb", label: "Low carb" },
  { value: "low-fodmap", label: "Low FODMAP" },
  { value: "nut-free", label: "Nut-free" },
  { value: "shellfish-free", label: "Shellfish-free" },
]

function parseDietaryString(value: string): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
}

export default function PageTwo({
  formData,
  updateFormData,
  onBack,
  onNext,
}: PageTwoProps) {
  const mealTime = formData.mealPrepDuration
  const activity = formData.activityLevel
  const days = formData.workoutDays
  const timeline = formData.timeline
  const firstName =
    (formData.fullName || "")
      .trim()
      .split(" ")
      .filter(Boolean)[0] ?? ""

  let hypeHeadline = "We’ll bend the plan around your real life."
  let hypeBody =
    "As you fill this in, VitaFit is already mapping meals and macros around your schedule - not some perfect routine."

  if (mealTime === "15-30") {
    hypeHeadline = `Perfect${firstName ? `, ${firstName}` : ""} - you’ve got quick cooking time.`
    hypeBody =
      "We’ll lean into fast, repeatable recipes, so you can stay consistent even on your busiest days."
  } else if (mealTime === "30-45") {
    hypeHeadline = `Nice${firstName ? `, ${firstName}` : ""} - you've got solid time in the kitchen.`
    hypeBody =
      "We’ll mix ultra-fast meals with a few “look forward to it” recipes that still fit your macros."
  } else if (mealTime === "45-60" || mealTime === "60+") {
    hypeHeadline = `Love this - we’ve got real room to cook.`
    hypeBody =
      "We’ll use that time for more variety and higher-satiety meals, while still keeping prep feeling simple."
  }

  let confidence = 70
  if (activity === "lightly-active" || activity === "moderately-active") {
    confidence += 3
  } else if (activity === "active" || activity === "very-active") {
    confidence += 6
  }
  const daysNum = days ? parseInt(days) : 0
  if (daysNum >= 3 && daysNum <= 5) confidence += 4
  if (daysNum > 5) confidence += 6
  if (timeline === "1-month") confidence -= 4
  if (timeline === "6-months" || timeline === "1-year") confidence += 4
  if (confidence < 55) confidence = 55
  if (confidence > 92) confidence = 92
  const parsedDietary = parseDietaryString(formData.dietaryRestrictions)

  const toggleDietary = (value: string) => {
    const current = parseDietaryString(formData.dietaryRestrictions)
    const exists = current.includes(value)
    const next = exists
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateFormData({ dietaryRestrictions: next.join(", ") })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4 relative z-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-1.5 text-gray-900 relative inline-block">
          Activity Level and Timeline
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#18c260] to-transparent opacity-80"></span>
        </h2>
        <p className="text-xs text-gray-600 mt-1.5">
          Help us customize your plan
        </p>
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent"></div>
      </div>

      <div className="space-y-4">
        {/* Activity Level */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
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
                className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-200/50 hover:bg-white/80 hover:border-[#18c260]/50 cursor-pointer transition-all duration-300 group"
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
                  className="w-4 h-4 text-[#18c260] bg-white border-emerald-300/50 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.4)] focus:outline-none cursor-pointer transition-all duration-300 group-hover:border-[#18c260]/50"
                />
                <span className="text-xs text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label htmlFor="timeline" className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Timeline for goal <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="timeline"
            required
            value={formData.timeline}
            onChange={(e) => updateFormData({ timeline: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select timeline</option>
            <option value="1-month">1 Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
            <option value="1-year">1 Year</option>
          </Select>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-700">
            Dietary Restrictions{" "}
            <span className="text-gray-500 text-xs">(tap all that apply)</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => {
              const isActive = parsedDietary.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleDietary(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? "border-[#18c260] bg-[#18c260]/30 text-white shadow-[0_0_20px_rgba(24,194,96,0.5)] backdrop-blur-sm"
                      : "border-emerald-200/50 bg-white/60 text-gray-700 hover:border-[#18c260]/60 hover:bg-[#18c260]/20 backdrop-blur-sm"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Workout Days per Week */}
        <div className="space-y-2">
          <Label htmlFor="workoutDays" className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Workout Days per Week <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="workoutDays"
            required
            value={formData.workoutDays}
            onChange={(e) =>
              updateFormData({ workoutDays: e.target.value })
            }
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
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

        {/* Workout Days Selection (multi) */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Workout Days (select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => {
              const value = day.toLowerCase()
              const isActive = formData.workoutDaysMulti.includes(value)
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const current = formData.workoutDaysMulti
                    const next = isActive
                      ? current.filter((d) => d !== value)
                      : [...current, value]
                    updateFormData({ workoutDaysMulti: next })
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? "border-[#18c260] bg-[#18c260]/30 text-white shadow-[0_0_20px_rgba(24,194,96,0.5)] backdrop-blur-sm"
                      : "border-emerald-200/50 bg-white/60 text-gray-700 hover:border-[#18c260]/60 hover:bg-[#18c260]/20 backdrop-blur-sm"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Workout Duration */}
        <div className="space-y-2">
          <Label htmlFor="workoutDuration" className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Workout Duration <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="workoutDuration"
            required
            value={formData.workoutDuration}
            onChange={(e) =>
              updateFormData({ workoutDuration: e.target.value })
            }
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select duration</option>
            <option value="30-45">30-45 mins</option>
            <option value="45-60">45-60 mins</option>
            <option value="60-90">60-90 mins</option>
            <option value="90+">90+ mins</option>
          </Select>
        </div>

        {/* Training Time of Day (multi-select chips) */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Training Time of Day (select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {["Morning", "Lunch", "Afternoon", "Evening"].map((slot) => {
              const value = slot.toLowerCase()
              const isActive = formData.trainingTimeOfDay.includes(value)
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    const current = formData.trainingTimeOfDay
                    const next = isActive
                      ? current.filter((d) => d !== value)
                      : [...current, value]
                    updateFormData({ trainingTimeOfDay: next })
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? "border-[#18c260] bg-[#18c260]/30 text-white shadow-[0_0_20px_rgba(24,194,96,0.5)] backdrop-blur-sm"
                      : "border-emerald-200/50 bg-white/60 text-gray-700 hover:border-[#18c260]/60 hover:bg-[#18c260]/20 backdrop-blur-sm"
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>

        {/* Meal Prep Duration */}
        <div className="space-y-2">
          <Label htmlFor="mealPrepDuration" className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Meal Prep Cooking Time <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="mealPrepDuration"
            required
            value={formData.mealPrepDuration}
            onChange={(e) =>
              updateFormData({ mealPrepDuration: e.target.value })
            }
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select duration</option>
            <option value="15-30">15-30 min</option>
            <option value="30-45">30-45 min</option>
            <option value="45-60">45-60 min</option>
            <option value="60+">60+ min</option>
          </Select>
        </div>

        {/* Hype / Plan insight card */}
        {(mealTime || activity || days || timeline) && (
          <div className="mt-1 space-y-3 rounded-2xl border border-[#18c260]/40 bg-[#18c260]/20 backdrop-blur-sm px-4 py-3 shadow-lg shadow-[#18c260]/20">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18c260]/40 text-sm text-black shadow-lg shadow-[#18c260]/50">
                ⚡
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">
                  {hypeHeadline}
                </p>
                <p className="mt-1 text-[11px] text-black/80">
                  {hypeBody}
                </p>
              </div>
            </div>
            <div className="pt-1">
              <p className="mb-1 flex items-center justify-between text-[11px] font-medium text-gray-900">
                <span>Plan confidence</span>
                <span>{confidence}/100</span>
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-100/50 backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#18c260] to-[#1FCC5F] transition-all duration-500 shadow-lg shadow-[#18c260]/50"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-700">
                As you tweak these, we'll rebalance meals, macros and prep-time so the plan feels doable.
              </p>
            </div>
          </div>
        )}

        {/* Back and Next Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <ShimmerButton
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto h-11 rounded-xl text-sm font-medium border-white/30 hover:bg-white/20 text-black backdrop-blur-sm"
          >
            Back
          </ShimmerButton>
          <ShimmerButton 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onNext()
            }}
            className="flex-1 h-11 rounded-xl text-sm font-medium"
          >
            Next Step
          </ShimmerButton>
        </div>
      </div>
    </div>
  )
}

