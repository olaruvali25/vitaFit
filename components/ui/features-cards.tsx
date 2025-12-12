"use client"

import type React from "react"
import { Warp } from "@paper-design/shaders-react"
import { FadeInView } from "@/components/ui/fade-in-view"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: "Adapts to Your Life",
    description:
      "VitaFit analyzes your goals, routine, and preferences then builds a plan you can actually stick to.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Weekly Adjustments",
    description: "Your body changes. Your schedule changes.  Your plan changes with you. Every week, VitaFit updates everything.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>
    ),
  },
  {
    title: "Progress That’s Clear",
    description: "See exactly how your weight, calories, and habits are improving so you stay motivated without the overwhelm.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
  },
  {
    title: "Fully Custom Meals",
    description: "Don't like an ingredient? Swap it instantly. Add foods you enjoy and VitaFit rebuilds your macros automatically.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 4V3h10v1H7zM7 18V6h10v12H7z" />
      </svg>
    ),
  },
]

export default function FeaturesCards() {
  const getShaderConfig = (index: number) => {
    const configs = [
      {
        proportion: 0.3,
        softness: 0.8,
        distortion: 0.15,
        swirl: 0.6,
        swirlIterations: 8,
        shape: "checks" as const,
        shapeScale: 0.08,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.4,
        softness: 1.2,
        distortion: 0.2,
        swirl: 0.9,
        swirlIterations: 12,
        shape: "checks" as const,
        shapeScale: 0.12,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.35,
        softness: 0.9,
        distortion: 0.18,
        swirl: 0.7,
        swirlIterations: 10,
        shape: "checks" as const,
        shapeScale: 0.1,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.45,
        softness: 1.1,
        distortion: 0.22,
        swirl: 0.8,
        swirlIterations: 15,
        shape: "checks" as const,
        shapeScale: 0.09,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.38,
        softness: 0.95,
        distortion: 0.16,
        swirl: 0.85,
        swirlIterations: 11,
        shape: "checks" as const,
        shapeScale: 0.11,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.42,
        softness: 1.0,
        distortion: 0.19,
        swirl: 0.75,
        swirlIterations: 9,
        shape: "checks" as const,
        shapeScale: 0.13,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
    ]
    return configs[index % configs.length]
  }

  return (
    <section id="about" className="relative py-32 overflow-hidden scroll-mt-20">
      {/* Green gradient background - fading from light green (same as reviews bottom) to LogoCloudTwo color at bottom with smooth blend */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-100/60 via-green-100/50 via-green-950/30 via-green-950/40 via-green-950/50 via-green-950/30 via-green-950/20 to-slate-950"></div>
        {/* Light green overlay at top - matches Reviews section bottom for seamless blending */}
        <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-emerald-50/90 via-teal-50/80 via-emerald-100/60 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-[#18c260]/[0.12] via-[#18c260]/[0.06] to-transparent"></div>
        {/* Smooth blending overlay that transitions to LogoCloudTwo colors */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-slate-950 via-green-950/20 via-green-950/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#18c260]/[0.08] via-green-500/[0.05] via-green-500/[0.03] to-transparent"></div>
      </div>
      {/* Green shadows at corners */}
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-teal-800/20 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <FadeInView>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Personalization at its best</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              VitaFit adapts to you. Personalization is everything, so the plan is built exactly for your body, your schedule, and your goals!
            </p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const shaderConfig = getShaderConfig(index)
            return (
              <FadeInView 
                key={index} 
                delay={index * 0.1}
                className={`relative h-80 ${index === 3 ? 'md:col-span-2 lg:col-span-3 max-w-md mx-auto w-full' : ''}`}
              >
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={shaderConfig.proportion}
                    softness={shaderConfig.softness}
                    distortion={shaderConfig.distortion}
                    swirl={shaderConfig.swirl}
                    swirlIterations={shaderConfig.swirlIterations}
                    shape={shaderConfig.shape}
                    shapeScale={shaderConfig.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.8}
                    colors={shaderConfig.colors}
                  />
                </div>

                <div className="relative z-10 p-8 rounded-3xl h-full flex flex-col bg-black/80 border border-white/20 dark:border-white/10">
                  <div className="mb-6 filter drop-shadow-lg">{feature.icon}</div>

                  <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#18c260] via-green-300 to-[#1FCC5F]" 
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(24, 194, 96, 0.5))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed flex-grow text-gray-100 font-medium">{feature.description}</p>
                </div>
              </FadeInView>
            )
          })}
        </div>
      </div>
    </section>
  )
}

