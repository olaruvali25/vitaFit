"use client"

import React, { useEffect, useRef } from "react"

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  speed: number
  length: number
  opacity: number
  lastReset?: number
}

export function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<ShootingStar[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

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

    const createStar = (): ShootingStar => {
      const side = Math.floor(Math.random() * 4)
      let x = 0
      let y = 0
      let angle = 0

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width
          y = 0
          angle = Math.random() * Math.PI + Math.PI / 4
          break
        case 1: // Right
          x = canvas.width
          y = Math.random() * canvas.height
          angle = Math.random() * Math.PI + Math.PI / 2
          break
        case 2: // Bottom
          x = Math.random() * canvas.width
          y = canvas.height
          angle = Math.random() * Math.PI + (3 * Math.PI) / 4
          break
        case 3: // Left
          x = 0
          y = Math.random() * canvas.height
          angle = Math.random() * Math.PI
          break
      }

      return {
        id: Math.random(),
        x,
        y,
        angle,
        speed: 0.05 + Math.random() * 0.05, // Extremely slow speed
        length: 15 + Math.random() * 20, // Shorter length
        opacity: 0.12 + Math.random() * 0.1, // Very low opacity
        lastReset: Date.now(),
      }
    }

    // Start with empty array - no stars initially
    starsRef.current = []

    // Add first star after 10 seconds delay
    setTimeout(() => {
      const initialStar = createStar()
      initialStar.lastReset = Date.now()
      starsRef.current = [initialStar]
    }, 10000)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Only process if we have stars (might be empty initially)
      if (starsRef.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      starsRef.current.forEach((star, index) => {
        // Update position
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed

        // Draw star trail
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )

        // Black color for visibility on light background
        gradient.addColorStop(0, `rgba(0, 0, 0, ${star.opacity})`)
        gradient.addColorStop(0.5, `rgba(0, 0, 0, ${star.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.5 // Extremely thin line
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )
        ctx.stroke()

        // Draw star head/point - Black (very subtle, very small)
        const starGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 1)
        starGradient.addColorStop(0, `rgba(0, 0, 0, ${star.opacity * 0.5})`)
        starGradient.addColorStop(0.5, `rgba(0, 0, 0, ${star.opacity * 0.2})`)
        starGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        
        ctx.fillStyle = starGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, 1, 0, Math.PI * 2)
        ctx.fill()

        // Reset star if it goes off screen - with delay to make them very rare
        if (
          star.x < -100 ||
          star.x > canvas.width + 100 ||
          star.y < -100 ||
          star.y > canvas.height + 100
        ) {
          // Reset star if it goes off screen - very slow reappearance (30+ seconds)
          const now = Date.now()
          if (!star.lastReset || (now - star.lastReset) > 30000) {
            // Only allow 1 star at a time - remove all others first
            starsRef.current = []
            const newStar = createStar()
            newStar.lastReset = now
            starsRef.current.push(newStar)
          }
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
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

