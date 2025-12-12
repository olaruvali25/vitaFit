"use client"

import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AssessmentFormData } from "./AssessmentForm"
import ShimmerButton from "./ShimmerButton"

interface PageThreeProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
  onBack: () => void
  onSubmit: () => void
}

export default function PageThree({
  formData,
  updateFormData,
  onBack,
  onSubmit,
}: PageThreeProps) {
  const firstName =
    (formData.fullName || "")
      .trim()
      .split(" ")
      .filter(Boolean)[0] ?? ""

  const mealTime = formData.mealPrepDuration
  const activity = formData.activityLevel
  const days = formData.workoutDays
  const timeline = formData.timeline
  const goalIntensity = formData.goalIntensity

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

  if (goalIntensity === "slow-steady") {
    hypeBody += " We’ll prioritize sustainability and minimal hunger."
  } else if (goalIntensity === "balanced") {
    hypeBody += " We’ll balance pace with adherence so you can keep this up."
  } else if (goalIntensity === "aggressive") {
    hypeBody += " We’ll push harder but keep recovery and nutrition aligned."
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
      <div className="text-center mb-4 relative z-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-1.5 text-gray-900 relative inline-block">
          Lifestyle and Preferences
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#18c260] to-transparent opacity-80"></span>
        </h2>
        <p className="text-xs text-gray-600 mt-1.5">
          A few more details to tailor your meals and routine
        </p>
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent"></div>
      </div>

      <div className="space-y-4">
        {/* Goal Intensity */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Goal Intensity / Rate of Change <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.goalIntensity}
            onChange={(e) => updateFormData({ goalIntensity: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select goal intensity</option>
            <option value="slow-steady">Slow & steady</option>
            <option value="balanced">Balanced progress</option>
            <option value="aggressive">Aggressive (but safe)</option>
          </Select>
        </div>

        {/* Daily Routine Type */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Daily Routine Type <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.dailyRoutine}
            onChange={(e) => updateFormData({ dailyRoutine: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select routine type</option>
            <option value="mostly-seated">Mostly seated</option>
            <option value="on-feet">On your feet most of the day</option>
            <option value="physically-demanding">Physically demanding job</option>
            <option value="mixed">Mixed/day varies</option>
          </Select>
        </div>

        {/* Eating Schedule Preference */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Eating Schedule Preference <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.eatingSchedule}
            onChange={(e) => updateFormData({ eatingSchedule: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select eating schedule</option>
            <option value="2-meals">2 meals/day</option>
            <option value="3-meals">3 meals/day</option>
            <option value="3-meals-snacks">3 meals + snacks</option>
            <option value="flexible">Flexible / no preference</option>
          </Select>
        </div>

        {/* Food Prep Preference */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Food Prep Preference <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.foodPrepPreference}
            onChange={(e) => updateFormData({ foodPrepPreference: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select food prep preference</option>
            <option value="daily-fresh">Daily fresh meals</option>
            <option value="prep-1x">Meal prep 1× per week</option>
            <option value="prep-2x">Meal prep 2× per week</option>
            <option value="prep-3x">Meal prep 3× per week</option>
          </Select>
        </div>

        {/* Sleep Quality */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Sleep Quality <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.sleepQuality}
            onChange={(e) => updateFormData({ sleepQuality: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select sleep quality</option>
            <option value="poor">Poor</option>
            <option value="average">Average</option>
            <option value="good">Good</option>
            <option value="great">Great</option>
          </Select>
        </div>

        {/* Stress Level */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Stress Level <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.stressLevel}
            onChange={(e) => updateFormData({ stressLevel: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select stress level</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </Select>
        </div>

        {/* Water Intake */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-gray-700 font-medium">
            Water Intake <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            required
            value={formData.waterIntake}
            onChange={(e) => updateFormData({ waterIntake: e.target.value })}
            className="h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 text-sm text-gray-900 focus:border-[#18c260]/70 focus:shadow-[0_0_0_2px_rgba(24,194,96,0.3),0_0_20px_rgba(24,194,96,0.2)] focus:outline-none transition-all duration-300 hover:bg-white/90 [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Select water intake</option>
            <option value="<1l">&lt;1 L</option>
            <option value="1-1.5l">1–1.5 L</option>
            <option value="1.5-2l">1.5–2 L</option>
            <option value="2-3l">2–3 L</option>
            <option value="3l+">3L+</option>
          </Select>
        </div>

        {/* Hype / Plan insight card */}
        {(mealTime || activity || days || timeline || goalIntensity) && (
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

        {/* Back and Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <ShimmerButton
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto h-11 rounded-xl text-sm font-medium border-white/30 hover:bg-white/20 text-white backdrop-blur-sm"
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

