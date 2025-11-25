"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  children: React.ReactNode
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    if (variant === "outline") {
      return (
        <Button
          ref={ref}
          variant="outline"
          className={cn(
            "relative overflow-hidden border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-105",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      )
    }

    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-[#18c260] text-white hover:bg-[#1FCC5F] transition-all duration-300 hover:scale-105 font-medium",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000 before:ease-in-out",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"

export default ShimmerButton

