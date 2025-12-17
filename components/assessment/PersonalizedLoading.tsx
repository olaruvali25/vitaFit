"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  // Goal-based messages - highly personalized
  if (goal.includes("weight loss") || goal.includes("lose")) {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Your weight loss transformation begins today. Every meal in your plan is calculated for your exact goals.`,
      `Stick to your personalized plan and you will achieve your weight loss goal in no time. Consistency is your superpower.`,
      `Your future self is already thanking you for taking this step. Your plan makes it simple.`,
      `${firstName ? `${firstName}, ` : ""}You have everything you need to succeed. Your meal plan is designed specifically for your body and goals.`
    )
  } else if (goal.includes("muscle") || goal.includes("gain")) {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Building muscle requires precision nutrition. Your personalized meal plan will fuel your gains perfectly.`,
      `Your dedication to muscle gain shows. Your plan matches your commitment with the exact macros you need.`,
      `Stay consistent with your nutrition and watch those muscles grow. Your plan makes it effortless.`,
      `${firstName ? `${firstName}, ` : ""}Every gram of protein in your plan is calculated for maximum muscle growth. You are set up for success.`
    )
  } else if (goal.includes("maintain") || goal.includes("health")) {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Maintaining your health is a daily commitment. Your personalized plan makes it sustainable.`,
      `Your plan is crafted to keep you feeling your best every single day.`,
      `Consistency beats perfection. Your plan is designed for real life, not perfection.`
    )
  } else {
    messages.push(
      `${firstName ? `${firstName}, ` : ""}Your personalized plan is being crafted just for you. Every detail matters.`,
      `Every small step counts. You are building a healthier future, one meal at a time.`,
      `Consistency beats perfection. Stick to your plan and see the results you deserve.`
    )
  }

  // Workout frequency messages - motivational and encouraging
  if (workoutDays <= 2) {
    messages.push(
      `Starting with ${workoutDays} workout${workoutDays !== 1 ? "s" : ""} per week is perfect. Small steps lead to big changes, and your meal plan supports this.`,
      `Even ${workoutDays} day${workoutDays !== 1 ? "s" : ""} a week can transform your body when combined with your personalized nutrition plan.`,
      `Your plan works around your schedule. No excuses needed. You can do this.`,
      `Consider adding one more workout day when you are ready. Your meal plan will adapt to support your increased activity.`,
      `Every workout counts. Your meal plan ensures you get maximum results from your ${workoutDays} training days.`
    )
  } else if (workoutDays >= 5) {
    messages.push(
      `${workoutDays} workouts per week shows serious commitment. Your meal plan will fuel your active lifestyle perfectly.`,
      `With ${workoutDays} training days, proper nutrition is crucial. Your plan is calibrated for your high activity level.`,
      `Your dedication is impressive. Your personalized plan matches your intensity with precision nutrition.`,
      `Your body works hard ${workoutDays} days a week. Your meal plan ensures it gets exactly what it needs to recover and perform.`
    )
  } else {
    messages.push(
      `${workoutDays} workouts per week is a great balance. Your meal plan will support your fitness goals perfectly.`,
      `You are building a sustainable routine and that is the key to long-term success. Your plan makes it easy.`,
      `Your plan is designed to work with your ${workoutDays}-day schedule. No stress, just results.`,
      `${workoutDays} training days means you need smart nutrition. Your plan delivers exactly that.`
    )
  }

  // Workout duration messages - encouraging for short workouts
  if (workoutDuration === "15-30 minutes" || workoutDuration === "30-45 minutes") {
    messages.push(
      `Short, focused workouts are incredibly effective. Your meal plan maximizes every minute you spend training.`,
      `Efficient workouts combined with smart nutrition lead to strong results. Your plan is designed for efficiency.`,
      `You do not need hours in the gym. Consistency with your plan is what matters most.`,
      `Quality over quantity. Your ${workoutDuration} workouts plus your personalized meal plan equals success.`,
      `Time efficient training is smart. Your meal plan ensures you get maximum results from your focused workouts.`
    )
  } else if (workoutDuration === "45-60 minutes" || workoutDuration === "1+ hours") {
    messages.push(
      `Longer workouts require proper fueling. Your meal plan is designed to support your extended training sessions.`,
      `Your commitment to longer workouts shows dedication. Your nutrition plan matches that commitment.`,
      `Extended training sessions need smart nutrition. Your plan ensures you have the energy and recovery you need.`
    )
  }

  // Timeline messages - goal-oriented
  if (timeline === "1-month") {
    messages.push(
      `With a one month timeline, every day counts. Your plan is designed for quick, sustainable results.`,
      `You have 30 days to transform your habits. You can do this. Your plan makes it simple.`,
      `One month can change everything. Your personalized meal plan is your roadmap to success.`,
      `30 days of consistency with your plan will show you what is possible. Stay focused.`
    )
  } else if (timeline === "3-months") {
    messages.push(
      `Three months is the perfect timeframe to see real transformation. Your plan will guide you every step.`,
      `90 days of following your personalized plan will create lasting habits. You are building something real.`,
      `Your three month journey starts now. Your meal plan is designed to keep you consistent and motivated.`
    )
  } else if (timeline === "6-months" || timeline === "1-year") {
    messages.push(
      `Long term thinking is the smart approach. Your plan will evolve with you over ${timeline === "6-months" ? "six months" : "the next year"}.`,
      `Sustainable changes over ${timeline === "6-months" ? "six months" : "a year"} mean you are building something real. Your plan supports this.`,
      `${timeline === "6-months" ? "Six months" : "A year"} of consistency will transform your life. Your personalized plan makes it effortless.`,
      `You are thinking long term, and that is powerful. Your meal plan is designed for sustainable success.`
    )
  }

  // Activity level messages - personalized encouragement
  if (activityLevel.includes("very-active") || activityLevel.includes("active")) {
    messages.push(
      `Your active lifestyle deserves premium nutrition. Your meal plan delivers exactly what your body needs.`,
      `High activity means higher nutrition needs. Your plan is calibrated perfectly for your active lifestyle.`,
      `Your body works hard. Your meal plan ensures it gets the fuel and recovery it deserves.`,
      `Active people need smart nutrition. Your personalized plan is designed for people who move.`
    )
  } else if (activityLevel.includes("lightly-active") || activityLevel.includes("sedentary")) {
    messages.push(
      `Starting your fitness journey is brave. Your meal plan will help you build healthy habits from day one.`,
      `Every journey begins with a single step. You are taking it. Your plan will guide you.`,
      `Your meal plan is designed to support you as you become more active. It adapts with you.`,
      `Building healthy habits starts with nutrition. Your personalized plan makes it simple and sustainable.`,
      `You are taking the first step. Your meal plan will support you as you build momentum.`
    )
  }

  // Highly personalized motivational quotes
  messages.push(
    `The only bad workout is the one that did not happen. Your plan makes it easier to show up every day.`,
    `Progress, not perfection. Your personalized plan is designed for real life, not perfection.`,
    `You are what you eat. Your plan keeps this simple, clear, and personalized to your goals.`,
    `Small changes, big results. Your plan is built around this powerful idea.`,
    `Your body can do it. It is your mind you need to convince. Your plan will help with that every single day.`,
    `Consistency is the secret. Your meal plan removes the guesswork so you can focus on showing up.`,
    `You did not come this far to only come this far. Your personalized plan is your next step forward.`,
    `Success is the sum of small efforts repeated day in and day out. Your plan makes those efforts effortless.`,
    `Your future self is counting on you. Your meal plan is your promise to that future self.`,
    `The best time to start was yesterday. The second best time is now. Your plan is ready.`
  )

  return messages
}

export function PersonalizedLoading({ assessmentData, onComplete, planReady = false }: PersonalizedLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const messages = generateMotivationalMessages(assessmentData)
  const firstName = assessmentData.fullName?.split(" ")[0] || ""

  useEffect(() => {
    // Rotate messages every 12 seconds (longer display time for better reading)
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 12000)

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

