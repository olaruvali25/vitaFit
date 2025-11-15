"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import { LogoCloud } from './logo-cloud'

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
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    const [formData, setFormData] = React.useState({
        goal: "",
        gender: "",
        age: "",
        weight: "",
        height: "",
        activity: "",
    })

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Store form data and redirect to full assessment
        window.location.href = "/assessment"
    }

    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-48">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-balance text-5xl font-medium md:text-6xl">
                                Your Personal AI Nutritionist & Fitness Planner
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                                Get a weekly meal plan and workout routine, tailored to your lifestyle, schedule, and goals.
                            </TextEffect>

                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    item: transitionVariants.item,
                                }}
                                className="mt-12">
                                {/* Assessment Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="mx-auto max-w-2xl space-y-6 bg-background rounded-[calc(var(--radius)+0.5rem)] border p-6 shadow-lg">
                                    <div className="text-left">
                                        <h3 className="text-xl font-semibold mb-2">Quick Assessment</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Get started with a personalized plan in minutes
                                        </p>
                                    </div>
                                    
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="goal">Goal</Label>
                                            <Select
                                                id="goal"
                                                value={formData.goal}
                                                onChange={(e) => handleChange("goal", e.target.value)}
                                                required>
                                                <option value="">Select goal</option>
                                                <option value="lose">Lose Weight</option>
                                                <option value="build">Build Muscle</option>
                                                <option value="maintain">Maintain</option>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select
                                                id="gender"
                                                value={formData.gender}
                                                onChange={(e) => handleChange("gender", e.target.value)}
                                                required>
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="25"
                                                value={formData.age}
                                                onChange={(e) => handleChange("age", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (kg)</Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                placeholder="70"
                                                value={formData.weight}
                                                onChange={(e) => handleChange("weight", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="height">Height (cm)</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                placeholder="175"
                                                value={formData.height}
                                                onChange={(e) => handleChange("height", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="activity">Activity Level</Label>
                                        <Select
                                            id="activity"
                                            value={formData.activity}
                                            onChange={(e) => handleChange("activity", e.target.value)}
                                            required>
                                            <option value="">Select activity level</option>
                                            <option value="sedentary">Sedentary</option>
                                            <option value="light">Light</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="active">Active</option>
                                            <option value="athlete">Athlete</option>
                                        </Select>
                                    </div>
                                    
                                    <Button type="submit" className="w-full" size="lg">
                                        Continue to Full Assessment
                                    </Button>
                                </form>

                                <div
                                    aria-hidden
                                    className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left">
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
                <LogoCloud />
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
                <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">This month, you're making great progress toward your fitness goals.</div>
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
