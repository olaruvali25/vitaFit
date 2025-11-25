"use client"

import AssessmentForm from "@/components/forms/AssessmentForm"
import type { AssessmentFormData } from "@/components/forms/AssessmentForm"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

export default function AssessmentPage() {
  const handleFormSubmit = (data: AssessmentFormData) => {
    // Store form data and redirect to full assessment
    console.log("Form submitted:", data)
    // In production, you can send this to Make.com webhook or your backend
    // For now, show success message
    alert("Assessment submitted! Your personalized plan will be generated shortly.")
  }

  return (
    <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 min-h-screen">
        {/* Nature-inspired wellness background layers */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Base gradient - lighter nature tones */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(24, 194, 96, 0.15) 0%, rgba(24, 194, 96, 0.05) 25%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 30%, transparent 55%),
                radial-gradient(circle at 50% 50%, rgba(230, 247, 236, 0.08) 0%, transparent 40%),
                linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.3) 50%, rgba(15, 23, 42, 0.95) 100%)
              `
            }}
          />
          {/* Soft light rays for wellness feel */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                linear-gradient(180deg, transparent 0%, rgba(24, 194, 96, 0.03) 20%, transparent 40%),
                linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.02) 30%, transparent 60%)
              `
            }}
          />
        </div>
        {/* Shooting Stars - must be above gradient */}
        <ShootingStars />
        <StarsBackground />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-32 lg:pt-40">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-medium md:text-5xl text-white mb-4">
              Your Personal <span className="text-[#18c260] relative inline-block" style={{
                background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s ease-in-out infinite'
              }}>AI Nutritionist</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/80">
              No more guessing. No more random diets.
              Just a weekly plan built exactly for your body, your schedule, and your goals, so you finally stay consistent and see real results.
            </p>

            <div className="mt-8">
              {/* Assessment Form */}
              <AssessmentForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

