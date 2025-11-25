import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface AccordionContextValue {
  openItems: Set<string>
  onToggle: (value: string) => void
  type?: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    defaultValue?: string | string[]
    onValueChange?: (value: string | null) => void
  }
>(({ className, type = "single", defaultValue, onValueChange, ...props }, ref) => {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (!defaultValue) return new Set()
    if (type === "single") {
      return new Set([defaultValue as string])
    }
    return new Set(defaultValue as string[])
  })

  const onToggle = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      let newValue: string | null = null
      
      if (next.has(value)) {
        next.delete(value)
        if (type === "single") {
          newValue = null
        }
      } else {
        if (type === "single") {
          next.clear()
          next.add(value)
          newValue = value
        } else {
          next.add(value)
        }
      }
      
      if (type === "single" && onValueChange) {
        onValueChange(newValue)
      }
      
      return next
    })
  }, [type, onValueChange])

  return (
    <AccordionContext.Provider value={{ openItems, onToggle, type }}>
      <div ref={ref} className={cn("w-full", className)} {...props} />
    </AccordionContext.Provider>
  )
})
Accordion.displayName = "Accordion"

const AccordionItemContext = React.createContext<{ value: string } | undefined>(undefined)

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionItem must be used within Accordion")
  
  const isOpen = context.openItems.has(value)

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        ref={ref}
        className={cn(className)}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      />
    </AccordionItemContext.Provider>
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionTrigger must be used within Accordion")
  
  const item = React.useContext(AccordionItemContext)
  if (!item) throw new Error("AccordionTrigger must be used within AccordionItem")
  
  const isOpen = context.openItems.has(item.value)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => context.onToggle(item.value)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionContent must be used within Accordion")
  
  const item = React.useContext(AccordionItemContext)
  if (!item) throw new Error("AccordionContent must be used within AccordionItem")
  
  const isOpen = context.openItems.has(item.value)

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

