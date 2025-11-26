"use client"

import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AssessmentFormData } from "./AssessmentForm"
import ShimmerButton from "./ShimmerButton"

interface PageTwoProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
  onBack: () => void
  onSubmit: () => void
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
  onSubmit,
}: PageTwoProps) {
  const parsedDietary = parseDietaryString(formData.dietaryRestrictions)

  const toggleDietary = (value: string) => {
    const current = parseDietaryString(formData.dietaryRestrictions)
    const exists = current.includes(value)
    const next = exists
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateFormData({ dietaryRestrictions: next.join(", ") })
  }

  const firstName =
    (formData.fullName || "")
      .trim()
      .split(" ")
      .filter(Boolean)[0] ?? ""

  const mealTime = formData.mealPrepDuration
  const activity = formData.activityLevel
  const days = formData.workoutDays
  const timeline = formData.timeline

  let hypeHeadline = "We’ll bend the plan around your real life."
  let hypeBody =
    "As you fill this in, VitaFit is already mapping meals and macros around your schedule — not some perfect routine."

  if (mealTime === "15-30") {
    hypeHeadline = `Perfect${firstName ? `, ${firstName}` : ""} — you’ve got quick cooking time.`
    hypeBody =
      "We’ll lean into fast, repeatable recipes, so you can stay consistent even on your busiest days."
  } else if (mealTime === "30-45") {
    hypeHeadline = `Nice${firstName ? `, ${firstName}` : ""} — you've got solid time in the kitchen.`
    hypeBody =
      "We’ll mix ultra-fast meals with a few “look forward to it” recipes that still fit your macros."
  } else if (mealTime === "45-60" || mealTime === "60+") {
    hypeHeadline = `Love this — we’ve got real room to cook.`
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

      <div className="space-y-4">
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
        <div className="space-y-2">
          <Label className="text-xs text-white/80">
            Dietary Restrictions{" "}
            <span className="text-white/50 text-xs">(tap all that apply)</span>
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
                      ? "border-emerald-300 bg-emerald-500/20 text-emerald-50 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
                      : "border-white/20 bg-white/5 text-white/75 hover:border-emerald-300/60 hover:bg-emerald-500/10"
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

        {/* Hype / Plan insight card */}
        {(mealTime || activity || days || timeline) && (
          <div className="mt-1 space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm text-emerald-200">
                ⚡
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-50">
                  {hypeHeadline}
                </p>
                <p className="mt-1 text-[11px] text-emerald-50/90">
                  {hypeBody}
                </p>
              </div>
            </div>
            <div className="pt-1">
              <p className="mb-1 flex items-center justify-between text-[11px] font-medium text-emerald-100">
                <span>Plan confidence</span>
                <span>{confidence}/100</span>
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-900/40">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-emerald-50/80">
                As you tweak these, we&apos;ll rebalance meals, macros and prep-time
                so the plan actually feels doable.
              </p>
            </div>
          </div>
        )}

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
          <ShimmerButton 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSubmit()
            }}
            className="flex-1 h-11 rounded-xl text-sm font-medium"
          >
            Submit Assessment
          </ShimmerButton>
        </div>
      </div>
    </div>
  )
}

