"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import AssessmentForm from './forms/AssessmentForm'
import type { AssessmentFormData } from './forms/AssessmentForm'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { StarsBackground } from '@/components/ui/stars-background'
import LogoCloudTwo from '@/components/ui/logo-cloud-two'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Star } from 'lucide-react'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 0.8,
            },
        },
    },
}

const reviews = [
    {
        name: "Sarah M.",
        rating: 5,
        text: "For the first time, I'm not starving or stressed from a diet. Everything fits my schedule perfectly. I've never stayed this consistent.",
        image: "https://i.pravatar.cc/80?img=12",
    },
    {
        name: "Daniel K.",
        rating: 5,
        text: "Down 7kg and the meals feel like something I'd actually choose to eat. It doesn't feel like a diet, it feels like my life finally has structure.",
        image: "https://i.pravatar.cc/80?img=32",
    },
    {
        name: "Amelia R.",
        rating: 5,
        text: "I always quit after a week… but VitaFit checks in, adjusts my plan, and keeps me grounded. It feels like someone finally understands how busy my life is.",
        image: "https://i.pravatar.cc/80?img=24",
    },
    {
        name: "Leo P.",
        rating: 5,
        text: "I'm eating more, feeling better, and my energy is insane. The personalized macros changed everything for me.",
        image: "https://i.pravatar.cc/80?img=5",
    },
    {
        name: "Maya T.",
        rating: 5,
        text: "I didn't realize how much time I was wasting deciding what to eat. Now it's all planned, balanced, and I'm actually seeing results.",
        image: "https://i.pravatar.cc/80?img=47",
    },
]

export default function HeroSection() {
    const handleFormSubmit = (data: AssessmentFormData) => {
        // Store form data and redirect to full assessment
        console.log("Form submitted:", data)
        // In production, you can send this to Make.com webhook or your backend
        // For now, redirect to assessment page
        window.location.href = "/assessment"
    }

    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
                <section id="assessment" className="relative overflow-hidden bg-gradient-to-b from-emerald-100 via-emerald-50 via-teal-50 via-emerald-100/60 via-green-100/40 to-green-950/30 scroll-mt-20">
                    {/* Page-specific light background with green/teal gradient - darker at bottom */}
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-emerald-100/90 via-emerald-50/85 via-teal-50/70 via-emerald-100/60 via-green-100/40 to-green-950/20" />
                    {/* Green shadows at corners - more intense */}
                    <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl -z-10" />
                    <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl -z-10" />
                    <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl -z-10" />
                    <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-teal-800/20 rounded-full blur-3xl -z-10" />
                    {/* Additional green gradient overlay for blending */}
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-green-500/5 to-green-950/15" />
                    {/* Shooting Stars - must be above gradient */}
                    <ShootingStars />
                    <StarsBackground />
                    <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 lg:pt-28">
                        {/* Title and Description - Centered */}
                        <div className="relative z-10 mx-auto max-w-4xl text-center mb-8">
                            <h1 className="text-balance text-4xl font-medium md:text-5xl text-gray-900 mb-4">
                                Your Personal <span className="text-emerald-600 relative inline-block" style={{
                                    background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                                    backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    animation: 'shimmer 3s ease-in-out infinite'
                                }}>AI Nutritionist. The Plan That Fits YOUR Life! </span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-gray-700">
                            No more guessing. No more random diets.
                            Just a weekly plan built exactly for your body, your schedule, and your goals, so you finally stay consistent and see real results.
                            </p>
                        </div>

                        {/* Assessment Form and Video - Side by Side */}
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            {/* Left Side - Assessment Form */}
                            <div className="w-full">
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.03,
                                                    delayChildren: 0.3,
                                                },
                                            },
                                        },
                                        item: transitionVariants.item,
                                    }}
                                    className="mt-8">
                                    <div className="flex justify-start">
                                        <AssessmentForm onSubmit={handleFormSubmit} />
                                    </div>

                                </AnimatedGroup>
                            </div>

                            {/* Right Side - Video Showcase */}
                            <div className="w-full lg:flex lg:items-start lg:justify-end">
                                <div className="w-full max-w-sm mx-auto lg:mx-0 h-[420px] bg-gray-100 rounded-lg flex items-center justify-center relative lg:mt-[120px]">
                                    <p className="text-gray-400 text-sm">Video showcase coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Brand Logos Section */}
                <LogoCloudTwo />
                
                {/* Reviews Slider */}
                <section className="relative pb-16 md:pb-32 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 z-10">
                    {/* Page-specific light background with green/teal gradient */}
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 via-emerald-100/50 to-white/90" />
                    {/* Green shadows at corners */}
                    <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10" />
                    <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10" />
                    <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/8 rounded-full blur-3xl -z-10" />
                    <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-teal-700/8 rounded-full blur-3xl -z-10" />
                    {/* Blending overlay at bottom to connect with FeaturesCards */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#18c260]/[0.06] to-[#18c260]/[0.12] -z-10"></div>
                    <div className="group relative w-full z-10">
                        <div className="relative py-6 w-full overflow-hidden">
                            <InfiniteSlider speedOnHover={15} speed={30} gap={24}>
                                {reviews.map((review, index) => (
                                    <div key={index} className="flex">
                                        <CardContainer className="inter-var w-[340px]">
                                            <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-[#18c260]/[0.1] border-gray-200 w-full h-[180px] rounded-xl p-5 border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#18c260]/[0.1] flex flex-col">
                                                <GlowingEffect
                                                    spread={20}
                                                    glow={false}
                                                    disabled={false}
                                                    proximity={64}
                                                    inactiveZone={0.7}
                                                    borderWidth={2}
                                                    blur={0}
                                                    movementDuration={2}
                                                />
                                                <CardItem translateZ="30" className="relative z-10 flex flex-col h-full">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-gray-900 truncate">{review.name}</p>
                                                            <div className="flex gap-0.5 mt-1">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-3 h-3 ${i < review.rating ? 'fill-[#18c260] text-[#18c260]' : 'fill-gray-400 text-gray-400'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-900 flex-1">
                                                        {review.text}
                                                    </p>
                                                </CardItem>
                                            </CardBody>
                                        </CardContainer>
                                    </div>
                                ))}
                            </InfiniteSlider>
                            <ProgressiveBlur direction="left" blurIntensity={0.3} className="absolute top-0 h-full w-full max-w-[60px] opacity-50" />
                            <ProgressiveBlur direction="right" blurIntensity={0.3} className="absolute right-0 top-0 h-full w-full max-w-[60px] opacity-50" />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const AppComponent = () => {
    return (
        <div className="relative space-y-3 rounded-[1rem] bg-gray-800/50 p-4">
            <div className="flex items-center gap-1.5 text-emerald-500">
                <svg
                    className="size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32">
                    <g fill="none">
                        <path
                            fill="currentColor"
                            d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"></path>
                        <path
                            fill="currentColor"
                            d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"></path>
                    </g>
                </svg>
                <div className="text-sm font-medium text-gray-200">Progress</div>
            </div>
            <div className="space-y-3">
                <div className="text-gray-200 border-b border-gray-700/50 pb-3 text-sm font-medium">Progress Starts With One Good Week. VitaFit Makes Every Day Count.</div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-gray-200 align-baseline text-xl font-medium">12.5</span>
                            <span className="text-gray-400 text-xs">kg lost</span>
                        </div>
                        <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-600 to-teal-600 px-2 text-xs text-white">This Month</div>
                    </div>
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-gray-200 align-baseline text-xl font-medium">8.2</span>
                            <span className="text-gray-400 text-xs">kg lost</span>
                        </div>
                        <div className="text-gray-200 bg-gray-700/50 flex h-5 w-2/3 items-center rounded px-2 text-xs">Last Month</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
