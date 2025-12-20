"use client"

import React, { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const stars: Star[] = []
    const numStars = 100 // Increased number of stars

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: 0.2 + Math.random() * 0.3, // Increased opacity
        twinkleSpeed: 0.001 + Math.random() * 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        // Twinkling effect
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
        const currentOpacity = star.opacity * twinkle

        // Black color for visibility on light background
        ctx.fillStyle = `rgba(0, 0, 0, ${currentOpacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: "transparent", zIndex: 3 }}
    />
  )
}

