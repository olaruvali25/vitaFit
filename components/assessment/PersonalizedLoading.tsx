"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { AssessmentFormData } from "@/components/forms/AssessmentForm"
import { Sparkles, Target, Zap, Heart, TrendingUp } from "lucide-react"
import { OrbitalLoader } from "@/components/ui/orbital-loader"

interface PersonalizedLoadingProps {
  assessmentData: AssessmentFormData
  onComplete?: () => void
  planReady?: boolean
}

// Generate personalized motivational messages based on assessment data
function generateMotivationalMessages(data: AssessmentFormData): string[] {
  const messages: string[] = []
  const firstName = data.fullName?.split(" ")[0] || ""
  const goal = data.goal?.toLowerCase() || ""
  const workoutDays = parseInt(data.workoutDays || "0")
  const workoutDuration = data.workoutDuration || ""
  const timeline = data.timeline || ""
  const activityLevel = data.activityLevel || ""

  // Goal-based messages (no emojis, no dash phrases)
  if (goal.includes("weight loss") || goal.includes("lose")) {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Your weight loss journey starts now. Every meal counts.`,
      `Stick to your plan and you will see amazing results in no time.`,
      `Consistency is key. Your future self will thank you.`
    )
  } else if (goal.includes("muscle") || goal.includes("gain")) {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Building muscle takes dedication and you are already on the right track.`,
      `Your personalized meal plan will fuel your gains perfectly.`,
      `Stay consistent with your nutrition and watch those muscles grow.`
    )
  } else {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Your personalized plan is being crafted just for you.`,
      `Every small step counts. You are building a healthier future.`,
      `Consistency beats perfection. Stick to your plan and see the results.`
    )
  }

  // Workout frequency messages
  if (workoutDays <= 2) {
    messages.push(
      `Starting with ${workoutDays} workout${workoutDays !== 1 ? "s" : ""} per week is perfect. Small steps lead to big changes.`,
      `Even ${workoutDays} day${workoutDays !== 1 ? "s" : ""} a week can transform your body. Consistency is everything.`,
      `Your plan will work around your schedule. No excuses needed.`
    )
  } else if (workoutDays >= 5) {
    messages.push(
      `${workoutDays} workouts per week shows serious commitment. Your meal plan will fuel your active lifestyle.`,
      `With ${workoutDays} training days, proper nutrition is crucial and your plan supports that.`,
      `Your dedication is strong. Your personalized plan will match your intensity.`
    )
  } else {
    messages.push(
      `${workoutDays} workouts per week is a great balance. Your meal plan will support your fitness goals.`,
      `You are building a sustainable routine and that is the key to long-term success.`,
      `Your plan is designed to work with your ${workoutDays}-day schedule. No stress, just results.`
    )
  }

  // Workout duration messages
  if (workoutDuration === "15-30 minutes" || workoutDuration === "30-45 minutes") {
    messages.push(
      `Short, focused workouts are effective. Your meal plan will maximize every minute.`,
      `Efficient workouts combined with smart nutrition lead to strong results.`,
      `You do not need hours in the gym. Consistency with your plan is what matters.`
    )
  }

  // Timeline messages
  if (timeline === "1-month") {
    messages.push(
      `With a one month timeline, every day counts. Your plan is designed for quick, sustainable results.`,
      `You have 30 days to transform your habits. You can do this.`
    )
  } else if (timeline === "6-months" || timeline === "1-year") {
    messages.push(
      `Long term thinking is the smart approach. Your plan will evolve with you.`,
      `Sustainable changes over ${timeline === "6-months" ? "six months" : "a year"} mean you are building something real.`
    )
  }

  // Activity level messages
  if (activityLevel.includes("very-active") || activityLevel.includes("active")) {
    messages.push(
      `Your active lifestyle deserves strong nutrition and that is exactly what you are getting.`,
      `High activity means higher nutrition needs. Your plan is calibrated for that.`
    )
  } else if (activityLevel.includes("lightly-active") || activityLevel.includes("sedentary")) {
    messages.push(
      `If you are starting your fitness journey, your meal plan will help you build healthy habits from day one.`,
      `Every journey begins with a single step and you are taking it. Your plan will guide you.`
    )
  }

  // General motivational quotes
  messages.push(
    `"The only bad workout is the one that didn't happen." Your plan makes it easier to show up.`,
    `"Progress, not perfection." Your personalized plan is designed for real life.`,
    `"You are what you eat." Your plan keeps this simple and clear.`,
    `"Small changes, big results." Your plan is built around this idea.`,
    `"Your body can do it. It is your mind you need to convince." Your plan will help with that.`
  )

  return messages
}

export function PersonalizedLoading({ assessmentData, onComplete, planReady = false }: PersonalizedLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const messages = generateMotivationalMessages(assessmentData)
  const firstName = assessmentData.fullName?.split(" ")[0] || ""

  useEffect(() => {
    // Rotate messages every 15 seconds (much longer display time)
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 15000)

    // Simulate progress - slower and more realistic
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (planReady && prev < 100) {
          return Math.min(prev + 5, 100) // Fast progress when ready
        }
        if (prev >= 97) return 97 // Cap at 97% until plan is ready
        // Slower progress to avoid hitting 97% too quickly
        return Math.min(prev + Math.random() * 1.5, 97)
      })
    }, 800)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [messages.length, planReady])

  // When plan is ready, complete the loading
  useEffect(() => {
    if (planReady && onComplete) {
      // Set progress to 100% when plan is ready
      setProgress(100)
      // Wait a moment for smooth transition, then redirect
      setTimeout(() => {
        onComplete()
      }, 1500)
    }
  }, [planReady, onComplete])

  // This component will be controlled by parent - parent will call onComplete when plan is ready
  // Progress will be updated by parent via props if needed

  const currentMessage = messages[currentMessageIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18c260]/10 via-transparent to-[#18c260]/10" />
      </div>

      <div
        className="relative z-10 max-w-2xl mx-auto px-6 text-center"
        style={{ paddingBottom: "200px", marginTop: "-100px" }}
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#18c260] to-[#1FCC5F] shadow-lg shadow-[#18c260]/50">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          {firstName ? `Creating Your Plan ${firstName}` : "Creating Your Plan"}
        </motion.h2>

        {/* Orbital Loader */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <OrbitalLoader message="We are generating your plan with your exact numbers." />
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#18c260] to-[#1FCC5F]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">{Math.round(progress)}% Complete</p>
        </motion.div>

        {/* Motivational Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="min-h-[80px] flex items-center justify-center"
          >
            <p className="text-lg md:text-xl text-white/90 font-medium px-4">
              {currentMessage}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Icons Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            <Target className="w-6 h-6 text-[#18c260]" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            <Zap className="w-6 h-6 text-[#18c260]" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            <Heart className="w-6 h-6 text-[#18c260]" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          >
            <TrendingUp className="w-6 h-6 text-[#18c260]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

