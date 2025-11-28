import * as React from "react"
import { cn } from "@/lib/utils"

// Define the shape of a single profile object
// The icon can now be a URL string or a React component
interface Profile {
  id: string
  label: string
  icon: string | React.ReactNode
  canDelete?: boolean // Whether this profile can be deleted (not the "Add Profile" button)
}

// Define the props for the main ProfileSelector component
interface ProfileSelectorProps {
  /** The main title displayed above the profiles */
  title?: string
  /** An array of profile objects to display */
  profiles: Profile[]
  /** Callback function when a profile is selected */
  onProfileSelect: (id: string) => void
  /** Callback function when a profile delete button is clicked */
  onDelete?: (id: string) => void
  /** Optional custom class names */
  className?: string
}

/**
 * A responsive and theme-adaptive component for selecting a user profile.
 * Supports both image URLs and React components for profile icons.
 */
export const ProfileSelector = ({
  title = "Who's watching?",
  profiles,
  onProfileSelect,
  onDelete,
  className,
}: ProfileSelectorProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center p-0",
        className
      )}
    >
      <div className="flex flex-col items-center w-full">
        {title && (
          <h1 className="mb-2 text-2xl font-medium text-white md:text-3xl">
            {title}
          </h1>
        )}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:gap-3 lg:grid-cols-5 xl:grid-cols-6 w-full max-w-5xl">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex flex-col items-center gap-1 group">
              <button
                onClick={() => onProfileSelect(profile.id)}
                aria-label={`Select profile: ${profile.label}`}
                className="group relative h-16 w-16 rounded-full transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 md:h-20 md:w-20"
              >
                {/* Green outline with glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:border-emerald-500/60 group-hover:bg-gradient-to-br group-hover:from-emerald-500/30 group-hover:to-emerald-600/20"></div>
                
                {/* Animated glow ring on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
                </div>
                
                {/* Profile name text */}
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full z-10">
                  {typeof profile.icon === 'string' ? (
                    // Display first letter or initials of the name
                    <span className="text-xl md:text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
                      {profile.label.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    // For "Add Profile" button, show the icon
                    profile.icon
                  )}
                </div>
              </button>
              
              {/* Profile name label below */}
              <p className="text-xs font-medium text-white/80 transition-all duration-300 group-hover:text-white text-center leading-tight">
                {profile.label}
              </p>
              
              {/* Delete button - only show for actual profiles, not "Add Profile" */}
              {profile.canDelete && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(profile.id)
                  }}
                  className="mt-0 text-white/60 hover:text-red-500 transition-colors duration-200"
                  aria-label={`Delete profile: ${profile.label}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// This helper component is still useful for non-image icons like the 'Add' button
export const ProfileIcon = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "flex h-full w-full items-center justify-center text-2xl text-emerald-400 md:text-3xl",
      className
    )}
  >
    {children}
  </div>
)

