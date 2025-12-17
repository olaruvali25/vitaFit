"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { useSearchParams } from "next/navigation"
import PageOne from "./PageOne"
import PageTwo from "./PageTwo"
import PageThree from "./PageThree"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export interface AssessmentFormData {
  // Page 1 - Personal Details
  fullName: string
  email: string
  age: string
  gender: string
  weightKg: string
  weightLbs: string
  heightCm: string
  heightFt: string
  goal: string
  goalWeight: string
  
  // Page 2 - Activity Level and Timeline
  activityLevel: string
  timeline: string
  dietaryRestrictions: string
  workoutDays: string
  workoutDuration: string
  mealPrepDuration: string

  // Page 2 - additional
  workoutDaysMulti: string[]
  trainingTimeOfDay: string[]

  // Page 3 - Additional Preferences
  goalIntensity: string
  dailyRoutine: string
  eatingSchedule: string
  foodPrepPreference: string
  sleepQuality: string
  stressLevel: string
  waterIntake: string
}

interface AssessmentFormProps {
  onSubmit?: (data: AssessmentFormData) => void
}

export default function AssessmentForm({ onSubmit }: AssessmentFormProps) {
  const searchParams = useSearchParams()
  const { user } = useSupabase()
  const [currentPage, setCurrentPage] = useState(1)
  const profileType = searchParams?.get("profileType") || "main" // "main" | "additional"
  
  // Get initial email from URL params or sessionStorage
  const getInitialEmail = () => {
    if (typeof window !== "undefined") {
      const emailFromUrl = searchParams?.get("email")
      if (emailFromUrl) {
        return decodeURIComponent(emailFromUrl)
      }
      const emailFromStorage = sessionStorage.getItem("ctaEmail")
      if (emailFromStorage) {
        return emailFromStorage
      }
    }
    return ""
  }
  
  const [formData, setFormData] = useState<AssessmentFormData>({
    fullName: searchParams?.get("fullName") ? decodeURIComponent(searchParams.get("fullName") as string) : "",
    email: getInitialEmail(),
    age: "",
    gender: "",
    weightKg: "",
    weightLbs: "",
    heightCm: "",
    heightFt: "",
    goal: "",
    goalWeight: "",
    activityLevel: "",
    timeline: "",
    dietaryRestrictions: "",
    workoutDays: "",
    workoutDuration: "",
    mealPrepDuration: "",
    workoutDaysMulti: [],
    trainingTimeOfDay: [],
    goalIntensity: "",
    dailyRoutine: "",
    eatingSchedule: "",
    foodPrepPreference: "",
    sleepQuality: "",
    stressLevel: "",
    waterIntake: "",
  })
  
  // Update email if it comes from URL params after component mounts
  useEffect(() => {
    const emailFromUrl = searchParams?.get("email")
    const emailFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("ctaEmail") : null
    
    if (emailFromUrl && !formData.email) {
      setFormData(prev => ({ ...prev, email: decodeURIComponent(emailFromUrl) }))
    } else if (emailFromStorage && !formData.email) {
      setFormData(prev => ({ ...prev, email: emailFromStorage }))
    }
  }, [searchParams])

  // Prefill email for main profile with session email; keep blank for additional profiles
  useEffect(() => {
    if (profileType !== "additional" && user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user?.email || "" }))
    }
  }, [profileType, user?.email, formData.email])

  const updateFormData = (updates: Partial<AssessmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const validatePage1 = (): boolean => {
    const { fullName, email, age, gender, weightKg, weightLbs, heightCm, heightFt, goal, goalWeight } = formData
    
    // Basic required field validation
    if (!fullName.trim()) return false
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false
    if (!age.trim() || parseInt(age) < 1 || parseInt(age) > 120) return false
    if (!gender) return false
    if (!weightKg.trim() || !weightLbs.trim()) return false
    if (!heightCm.trim() || !heightFt.trim()) return false
    if (!goal) return false
    if (!goalWeight.trim()) return false
    
    return true
  }

  const validatePage2 = (): boolean => {
    const { activityLevel, timeline, workoutDays, workoutDuration, mealPrepDuration } = formData
    
    if (!activityLevel) return false
    if (!timeline) return false
    if (!workoutDays) return false
    if (!workoutDuration) return false
    if (!mealPrepDuration) return false
    
    return true
  }

  const validatePage3 = (): boolean => {
    const {
      goalIntensity,
      dailyRoutine,
      eatingSchedule,
      foodPrepPreference,
      sleepQuality,
      stressLevel,
      waterIntake,
    } = formData

    if (!goalIntensity) return false
    if (!dailyRoutine) return false
    if (!eatingSchedule) return false
    if (!foodPrepPreference) return false
    if (!sleepQuality) return false
    if (!stressLevel) return false
    if (!waterIntake) return false

    return true
  }

  const handleNext = () => {
    if (currentPage === 1 && validatePage1()) {
      setCurrentPage(2)
    }
  }

  const handleNextFromPage2 = () => {
    if (validatePage2()) {
      setCurrentPage(3)
    } else {
      console.error("[AssessmentForm] Validation failed on page 2")
    }
  }

  const handleBack = () => {
    if (currentPage === 2) {
      setCurrentPage(1)
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    // Prevent any default form submission
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!validatePage3()) {
      console.error("[AssessmentForm] Validation failed")
      return
    }

    // CRITICAL: Save to sessionStorage IMMEDIATELY, synchronously
    const dataString = JSON.stringify(formData)
    try {
      sessionStorage.setItem("assessmentData", dataString)
      console.log("[AssessmentForm] Data saved to sessionStorage:", dataString.substring(0, 100))
      
      // Verify it was saved
      const saved = sessionStorage.getItem("assessmentData")
      if (!saved || saved !== dataString) {
        console.error("[AssessmentForm] CRITICAL: Data verification failed!")
        alert("Error saving your data. Please try again.")
        return
      }
      console.log("[AssessmentForm] Data verified in sessionStorage")
    } catch (err) {
      console.error("[AssessmentForm] CRITICAL ERROR saving to sessionStorage:", err)
      alert("Error saving your data. Please try again.")
      return
    }
    
    // Now call onSubmit (which will check auth and redirect)
    if (onSubmit) {
      console.log("[AssessmentForm] Calling onSubmit handler")
      onSubmit(formData)
    } else {
      // Default behavior - log to console for now
      console.log("Form submitted:", formData)
      alert("Assessment submitted! Your personalized plan will be generated shortly.")
    }
  }

  // Convert kg to lbs
  const convertKgToLbs = (kg: string) => {
    if (!kg) return ""
    const kgNum = parseFloat(kg)
    if (isNaN(kgNum)) return ""
    return (kgNum * 2.20462).toFixed(1)
  }

  // Convert lbs to kg
  const convertLbsToKg = (lbs: string) => {
    if (!lbs) return ""
    const lbsNum = parseFloat(lbs)
    if (isNaN(lbsNum)) return ""
    return (lbsNum / 2.20462).toFixed(1)
  }

  // Convert cm to ft
  const convertCmToFt = (cm: string) => {
    if (!cm) return ""
    const cmNum = parseFloat(cm)
    if (isNaN(cmNum)) return ""
    const totalInches = cmNum / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = (totalInches % 12).toFixed(1)
    return `${feet}'${inches}"`
  }

  // Convert ft to cm
  const convertFtToCm = (ft: string) => {
    if (!ft) return ""
    // Parse format like "5'10""
    const match = ft.match(/(\d+)'(\d+(?:\.\d+)?)"/)
    if (!match) return ""
    const feet = parseInt(match[1])
    const inches = parseFloat(match[2])
    const totalInches = feet * 12 + inches
    return (totalInches * 2.54).toFixed(1)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-3 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-700">
            Step {currentPage} of 3
          </span>
          <span className="text-xs font-medium text-gray-700">
            {Math.round((currentPage / 3) * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-emerald-100/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-[#18c260] via-[#1FCC5F] to-[#18c260] rounded-full transition-all duration-500 ease-out relative overflow-hidden shadow-lg shadow-emerald-500/50"
            style={{ width: `${(currentPage / 3) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Modern Glass Card - See-through with amazing design */}
      <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-emerald-300/50 shadow-2xl shadow-emerald-500/10 p-5 md:p-6 overflow-visible group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-30"
            style={{
              background: 'radial-gradient(circle at 30% 20%, rgba(24,194,96,0.15), transparent 60%)'
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-full h-full opacity-20"
            style={{
              background: 'radial-gradient(circle at 70% 80%, rgba(16,185,129,0.12), transparent 60%)'
            }}
          />
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        </div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none z-0">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-green-400/10 to-emerald-500/20 opacity-50 blur-xl"></div>
        </div>
        
        <GlowingEffect
          spread={100}
          blur={20}
          borderWidth={2}
          glow={true}
          disabled={false}
          proximity={120}
          inactiveZone={0.4}
          movementDuration={2}
        />
        
        <div className="relative z-10 overflow-hidden">
        {currentPage === 1 && (
          <PageOne
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            convertKgToLbs={convertKgToLbs}
            convertLbsToKg={convertLbsToKg}
            convertCmToFt={convertCmToFt}
            convertFtToCm={convertFtToCm}
          />
        )}
        {currentPage === 2 && (
          <PageTwo
            formData={formData}
            updateFormData={updateFormData}
            onBack={handleBack}
            onNext={handleNextFromPage2}
          />
        )}
        {currentPage === 3 && (
          <PageThree
            formData={formData}
            updateFormData={updateFormData}
            onBack={() => setCurrentPage(2)}
            onSubmit={handleSubmit}
          />
        )}
        </div>
      </div>
    </div>
  )
}

