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
                <section id="assessment" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 scroll-mt-20">
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
                    <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-20 lg:pt-28">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
                            <h1 className="text-balance text-4xl font-medium md:text-5xl text-white mb-4">
                                Your Personal <span className="text-[#18c260] relative inline-block" style={{
                                    background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                                    backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    animation: 'shimmer 3s ease-in-out infinite'
                                }}>AI Nutritionist. The Plan That Fits YOUR Life! </span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/80">
                            No more guessing. No more random diets.
                            Just a weekly plan built exactly for your body, your schedule, and your goals, so you finally stay consistent and see real results.
                            </p>

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
                                {/* Assessment Form */}
                                <AssessmentForm onSubmit={handleFormSubmit} />

                                <div
                                    aria-hidden
                                    className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-16 max-w-2xl to-transparent to-55% text-left">
                                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                                        <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                                    </div>
                                    <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                                        <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                                            <AppComponent />

                                            <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>
                
                {/* Brand Logos Section */}
                <LogoCloudTwo />
                
                {/* Reviews Slider */}
                <section className="relative pb-16 md:pb-32 bg-gradient-to-br from-black via-green-950/20 to-black z-10">
                    {/* Green gradient background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#18c260]/[0.08] via-green-500/[0.05] to-[#18c260]/[0.08]"></div>
                    </div>
                    <div className="group relative w-full z-10">
                        <div className="relative py-6 w-full overflow-hidden">
                            <InfiniteSlider speedOnHover={15} speed={30} gap={24}>
                                {reviews.map((review, index) => (
                                    <div key={index} className="flex">
                                        <CardContainer className="inter-var w-[340px]">
                                            <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-[#18c260]/[0.1] dark:bg-card dark:border-white/[0.2] border-border w-full h-auto rounded-xl p-5 border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#18c260]/[0.1]">
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
                                                <CardItem translateZ="30" className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <img
                                                            src={review.image}
                                                            alt={review.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-foreground truncate">{review.name}</p>
                                                            <div className="flex gap-0.5 mt-1">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-3 h-3 ${i < review.rating ? 'fill-[#18c260] text-[#18c260]' : 'fill-muted text-muted-foreground'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
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
        <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-primary">
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
                <div className="text-sm font-medium">Progress</div>
            </div>
            <div className="space-y-3">
                <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">Progress Starts With One Good Week. VitaFit Makes Every Day Count.</div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">12.5</span>
                            <span className="text-muted-foreground text-xs">kg lost</span>
                        </div>
                        <div className="flex h-5 items-center rounded bg-gradient-to-l from-primary to-secondary px-2 text-xs text-white">This Month</div>
                    </div>
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">8.2</span>
                            <span className="text-muted-foreground text-xs">kg lost</span>
                        </div>
                        <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">Last Month</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
