"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const increment = () => {
      if (inputRef.current) {
        inputRef.current.stepUp()
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }))
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    const decrement = () => {
      if (inputRef.current) {
        inputRef.current.stepDown()
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }))
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    return (
      <div className="number-input-wrapper relative">
        <input
          type="number"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          {...props}
        />
        <div className="number-input-arrows">
          <button
            type="button"
            className="number-input-arrow"
            onClick={increment}
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14l5-5 5 5z" />
            </svg>
          </button>
          <button
            type="button"
            className="number-input-arrow"
            onClick={decrement}
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }

