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
  const animationFrameRef = useRef<number>()

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
        speed: 0.3 + Math.random() * 0.5,
        length: 20 + Math.random() * 30,
        opacity: 0.2 + Math.random() * 0.3,
        lastReset: Date.now(),
      }
    }

    const initStars = () => {
      // Start with 2 stars immediately
      starsRef.current = [createStar(), createStar()]
    }

    initStars()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

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

        // Pale green color - visible
        gradient.addColorStop(0, `rgba(200, 240, 220, ${star.opacity})`)
        gradient.addColorStop(0.5, `rgba(220, 245, 230, ${star.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(230, 250, 240, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )
        ctx.stroke()

        // Draw star head/point - visible
        const starGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 2.5)
        starGradient.addColorStop(0, `rgba(200, 240, 220, ${star.opacity * 0.8})`)
        starGradient.addColorStop(0.5, `rgba(220, 245, 230, ${star.opacity * 0.5})`)
        starGradient.addColorStop(1, "rgba(230, 250, 240, 0)")
        
        ctx.fillStyle = starGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()

        // Reset star if it goes off screen - with delay to make them more rare
        if (
          star.x < -100 ||
          star.x > canvas.width + 100 ||
          star.y < -100 ||
          star.y > canvas.height + 100
        ) {
          // Reset star if it goes off screen - quicker reappearance
          const now = Date.now()
          if (!star.lastReset || (now - star.lastReset) > 3000) {
            const newStar = createStar()
            newStar.lastReset = now
            starsRef.current[index] = newStar
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

