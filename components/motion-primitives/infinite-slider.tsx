"use client"

import React from 'react'

interface InfiniteSliderProps {
    children: React.ReactNode
    speed?: number
    speedOnHover?: number
    gap?: number
}

export function InfiniteSlider({ children, speed = 40, speedOnHover = 20, gap = 112 }: InfiniteSliderProps) {
    return (
        <div className="flex overflow-hidden" style={{ gap: `${gap}px` }}>
            <div className="flex animate-scroll" style={{ animationDuration: `${speed}s` }}>
                {React.Children.map(children, (child, index) => (
                    <div key={index} style={{ marginRight: `${gap}px` }}>
                        {child}
                    </div>
                ))}
            </div>
            <div className="flex animate-scroll" style={{ animationDuration: `${speed}s` }}>
                {React.Children.map(children, (child, index) => (
                    <div key={index} style={{ marginRight: `${gap}px` }}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    )
}

