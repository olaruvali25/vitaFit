"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressiveBlurProps {
    className?: string
    direction?: 'left' | 'right'
    blurIntensity?: number
}

export function ProgressiveBlur({ className, direction = 'left', blurIntensity = 1 }: ProgressiveBlurProps) {
    return (
        <div
            className={cn(
                'pointer-events-none',
                direction === 'left' ? 'bg-gradient-to-r from-background to-transparent' : 'bg-gradient-to-l from-background to-transparent',
                className
            )}
            style={{
                backdropFilter: `blur(${blurIntensity * 4}px)`,
                WebkitBackdropFilter: `blur(${blurIntensity * 4}px)`,
            }}
        />
    )
}

