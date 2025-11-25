"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AssessmentFormData } from "./AssessmentForm"
import ShimmerButton from "./ShimmerButton"

interface PageOneProps {
  formData: AssessmentFormData
  updateFormData: (updates: Partial<AssessmentFormData>) => void
  onNext: () => void
  convertKgToLbs: (kg: string) => string
  convertLbsToKg: (lbs: string) => string
  convertCmToFt: (cm: string) => string
  convertFtToCm: (ft: string) => string
}

export default function PageOne({
  formData,
  updateFormData,
  onNext,
  convertKgToLbs,
  convertLbsToKg,
  convertCmToFt,
  convertFtToCm,
}: PageOneProps) {
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg")
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm")
  const prevHeightFtRef = useRef(formData.heightFt)
  const isDeletingRef = useRef(false)

  const handleWeightChange = (value: string, unit: "kg" | "lbs") => {
    if (unit === "kg") {
      updateFormData({ weightKg: value, weightLbs: convertKgToLbs(value) })
    } else {
      updateFormData({ weightLbs: value, weightKg: convertLbsToKg(value) })
    }
  }

  const handleWeightUnitChange = (unit: "kg" | "lbs") => {
    setWeightUnit(unit)
    // Convert current value when switching units
    if (unit === "kg" && formData.weightLbs) {
      updateFormData({ weightKg: convertLbsToKg(formData.weightLbs) })
    } else if (unit === "lbs" && formData.weightKg) {
      updateFormData({ weightLbs: convertKgToLbs(formData.weightKg) })
    }
  }

  // Format height input: converts "510" → "5'10"" or "62" → "6'2""
  const formatHeightInput = (input: string, isDeleting: boolean): string => {
    if (!input || input.trim() === "") {
      return ""
    }
    
    // Extract only numbers from input
    const numbersOnly = input.replace(/\D/g, '')
    
    if (!numbersOnly) {
      return ""
    }
    
    // If deleting, allow partial input without forcing format
    if (isDeleting) {
      if (numbersOnly.length === 0) return ""
      if (numbersOnly.length === 1) return numbersOnly
      if (numbersOnly.length === 2) return `${numbersOnly[0]}'${numbersOnly[1]}"`
      if (numbersOnly.length >= 3) return `${numbersOnly[0]}'${numbersOnly.slice(1, 3)}"`
      return numbersOnly
    }
    
    // User is typing - format normally
    if (numbersOnly.length === 1) {
      return numbersOnly
    } else if (numbersOnly.length === 2) {
      return `${numbersOnly[0]}'${numbersOnly[1]}"`
    } else if (numbersOnly.length === 3) {
      return `${numbersOnly[0]}'${numbersOnly.slice(1)}"`
    } else {
      return `${numbersOnly[0]}'${numbersOnly.slice(-2)}"`
    }
  }

  const handleHeightChange = (value: string, unit: "cm" | "ft") => {
    if (unit === "cm") {
      updateFormData({ heightCm: value, heightFt: convertCmToFt(value) })
      prevHeightFtRef.current = formData.heightFt
    } else {
      const isDeleting = value.length < prevHeightFtRef.current.length
      
      // If empty, allow deletion
      if (!value || value.trim() === "") {
        updateFormData({ heightFt: "", heightCm: "" })
        prevHeightFtRef.current = ""
        return
      }
      
      // Extract numbers only
      const numbersOnly = value.replace(/\D/g, '')
      
      // If no numbers, allow empty
      if (!numbersOnly) {
        updateFormData({ heightFt: "", heightCm: "" })
        prevHeightFtRef.current = ""
        return
      }
      
      // If deleting, keep the raw value to allow deletion
      if (isDeleting) {
        // Only format if value ends with quote (complete), otherwise keep raw for deletion
        if (value.endsWith('"')) {
          const formatted = formatHeightInput(value, false)
          updateFormData({ heightFt: formatted, heightCm: convertFtToCm(formatted) })
          prevHeightFtRef.current = formatted
        } else {
          // Keep raw value during deletion - try to convert if possible, otherwise use empty
          const convertedCm = convertFtToCm(value) || ""
          updateFormData({ heightFt: value, heightCm: convertedCm })
          prevHeightFtRef.current = value
        }
        return
      }
      
      // Normal typing - format
      const formatted = formatHeightInput(value, false)
      updateFormData({ heightFt: formatted, heightCm: convertFtToCm(formatted) })
      prevHeightFtRef.current = formatted
    }
  }

  const handleHeightUnitChange = (unit: "cm" | "ft") => {
    setHeightUnit(unit)
    // Convert current value when switching units
    if (unit === "cm" && formData.heightFt) {
      updateFormData({ heightCm: convertFtToCm(formData.heightFt) })
    } else if (unit === "ft" && formData.heightCm) {
      updateFormData({ heightFt: convertCmToFt(formData.heightCm) })
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-1.5 text-white relative inline-block">
        Your Journey Starts Here
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#18c260] opacity-60"></span>
        </h2>
        <p className="text-xs text-white/70 mt-1.5">
        It takes you 60 seconds, we'll create the plan you've been missing to succeed!
        </p>
        <div className="mt-2 h-px bg-white/10"></div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onNext()
        }}
        className="space-y-4"
      >
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs text-white/80">
            Full Name <span className="text-[#18c260]">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-white/80">
            Email <span className="text-[#18c260]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Age */}
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-xs text-white/80">
              Age <span className="text-[#18c260]">*</span>
            </Label>
              <NumberInput
              id="age"
              required
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => updateFormData({ age: e.target.value })}
              className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
              placeholder="25"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <Label htmlFor="gender" className="text-xs text-white/80">
              Gender <span className="text-[#18c260]">*</span>
            </Label>
            <Select
              id="gender"
              required
              value={formData.gender}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Current Weight <span className="text-[#18c260]">*</span>
          </Label>
          <div className="flex gap-2">
            <NumberInput
              id="weight"
              required
              min={weightUnit === "kg" ? "30" : "66"}
              max={weightUnit === "kg" ? "300" : "660"}
              step="0.1"
              value={weightUnit === "kg" ? formData.weightKg : formData.weightLbs}
              onChange={(e) => handleWeightChange(e.target.value, weightUnit)}
              className="flex-1 h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
              placeholder={weightUnit === "kg" ? "70" : "154.3"}
            />
            <Select
              value={weightUnit}
              onChange={(e) => handleWeightUnitChange(e.target.value as "kg" | "lbs")}
              className="w-20 h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </Select>
          </div>
        </div>

        {/* Height */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Height <span className="text-[#18c260]">*</span>
          </Label>
          <div className="flex gap-2">
            {heightUnit === "cm" ? (
              <NumberInput
                id="height"
                required
                min="100"
                max="250"
                step="0.1"
                value={formData.heightCm}
                onChange={(e) => handleHeightChange(e.target.value, "cm")}
                className="flex-1 h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
                placeholder="175"
              />
            ) : (
              <Input
                id="height"
                type="text"
                required
                value={formData.heightFt}
                onChange={(e) => handleHeightChange(e.target.value, "ft")}
                className="flex-1 h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
                placeholder="ex: 5'10&quot;"
              />
            )}
            <Select
              value={heightUnit}
              onChange={(e) => handleHeightUnitChange(e.target.value as "cm" | "ft")}
              className="w-20 h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="cm">cm</option>
              <option value="ft">ft</option>
            </Select>
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <Label htmlFor="goal" className="text-xs uppercase tracking-wide text-white/60 font-medium">
            Goal <span className="text-[#18c260]">*</span>
          </Label>
          <Select
            id="goal"
            required
            value={formData.goal}
            onChange={(e) => updateFormData({ goal: e.target.value })}
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white focus:border-green-400/70 focus:ring-2 focus:ring-green-400/30 transition-all [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="">Select goal</option>
            <option value="weight-loss">Weight Loss</option>
            <option value="muscle-gain">Muscle Gain</option>
          </Select>
        </div>

        {/* Goal Weight */}
        <div className="space-y-1.5">
          <Label htmlFor="goalWeight" className="text-xs text-white/80">
            Goal Weight (kg) <span className="text-[#18c260]">*</span>
          </Label>
          <NumberInput
            id="goalWeight"
            required
            min="30"
            max="300"
            step="0.1"
            value={formData.goalWeight}
            onChange={(e) => updateFormData({ goalWeight: e.target.value })}
            className="h-10 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-[#18c260]/50 focus:shadow-[0_0_0_1px_rgba(24,194,96,0.15),0_0_12px_rgba(24,194,96,0.15)] focus:outline-none transition-all duration-300"
            placeholder="65"
          />
        </div>

        {/* Next Button */}
        <div className="pt-2">
          <ShimmerButton type="submit" className="w-full h-11 rounded-xl text-sm font-medium">
            Next Step
          </ShimmerButton>
        </div>
      </form>
    </div>
  )
}

