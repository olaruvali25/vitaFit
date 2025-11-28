"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ProfileSelector, ProfileIcon } from "./ProfileSelector"
import { Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  profilePicture: string | null
  createdAt?: string
}

interface MembershipInfo {
  plan: "BASIC" | "PLUS" | "FAMILY"
  status: string
  currentCount: number
  limit: number
  canCreate: boolean
}

export function ProfilesTab() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfo | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const [error, setError] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profilesRes, membershipRes] = await Promise.all([
        fetch("/api/profiles"),
        fetch("/api/membership"),
      ])

      if (profilesRes.ok) {
        const profilesData = await profilesRes.json()
        setProfiles(profilesData)
      }

      if (membershipRes.ok) {
        const membership = await membershipRes.json()
        setMembershipInfo({
          plan: membership.plan || "BASIC",
          status: membership.status || "INACTIVE",
          currentCount: membership.currentProfileCount || 0,
          limit: membership.profileLimit || 1,
          canCreate: membership.canCreateMore !== false,
        })
      }
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSelect = (profileId: string, profileName?: string) => {
    // Update URL to include profileId so PlansTab can read it
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const params = new URLSearchParams()
      params.set('profileId', profileId)
      if (profileName) {
        params.set('profileName', profileName)
      }
      const newUrl = `${currentPath}?${params.toString()}`
      router.push(newUrl)
    }
  }

  const handleAddProfileClick = () => {
    if (!membershipInfo) return

    const { plan, currentCount } = membershipInfo

    // BASIC/FREE TRIAL users with 1 profile: redirect to upgrade page
    if (plan === "BASIC" && currentCount >= 1) {
      router.push("/pricing?upgrade=PLUS")
      return
    }

    // Show modal for PLUS/FAMILY users or BASIC users with 0 profiles
    setShowAddModal(true)
  }

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      setError("Profile name is required")
      return
    }

    setError("")
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProfileName.trim() }),
      })

      if (response.ok) {
        setShowAddModal(false)
        setNewProfileName("")
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create profile")
      }
    } catch (err) {
      console.error("Failed to create profile:", err)
      setError("Failed to create profile")
    }
  }

  const handleDeleteClick = (profileId: string) => {
    setDeleteConfirmId(profileId)
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/profiles/${deleteConfirmId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDeleteConfirmId(null)
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete profile")
      }
    } catch (err) {
      console.error("Failed to delete profile:", err)
      alert("Failed to delete profile")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading profiles...</div>
      </div>
    )
  }

  // Sort profiles by createdAt ASC to find the main profile (first created)
  const sortedProfiles = [...profiles].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime()
    const dateB = new Date(b.createdAt || 0).getTime()
    return dateA - dateB
  })
  
  // The first profile (oldest) is the main profile
  const mainProfileId = sortedProfiles.length > 0 ? sortedProfiles[0].id : null

  // Convert profiles to ProfileSelector format - use name as icon identifier
  const profileItems: Array<{
    id: string
    label: string
    icon: string | React.ReactNode
    canDelete: boolean
    isMain?: boolean
  }> = profiles.map((profile) => ({
    id: profile.id,
    label: profile.name,
    icon: profile.name, // Use name instead of image URL
    canDelete: true, // All actual profiles can be deleted
    isMain: profile.id === mainProfileId, // Mark the main profile
  }))

  // Determine if we should show the "+" button
  const showAddButton = membershipInfo && (
    (membershipInfo.plan === "BASIC" && membershipInfo.currentCount < 1) || // BASIC can have 1
    (membershipInfo.plan === "BASIC" && membershipInfo.currentCount >= 1) || // BASIC with 1 profile shows button to upgrade
    (membershipInfo.plan === "PLUS" && membershipInfo.currentCount < 2) || // PLUS can have 2
    (membershipInfo.plan === "FAMILY" && membershipInfo.currentCount < 4) // FAMILY can have 4
  )

  if (showAddButton) {
    profileItems.push({
      id: "add-profile",
      label: membershipInfo?.plan === "BASIC" && membershipInfo.currentCount >= 1 
        ? "Add" 
        : "Add Profile",
      icon: (
        <ProfileIcon>
          <Plus className="w-12 h-12 md:w-16 md:h-16" />
        </ProfileIcon>
      ),
      canDelete: false, // "Add Profile" button cannot be deleted
    })
  }

  // Show empty state if no profiles
  if (profiles.length === 0 && !showAddButton) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-white/70 text-lg">No profiles yet. Create your first profile to get started.</p>
        <Button
          onClick={handleAddProfileClick}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create First Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <ProfileSelector
        title=""
        profiles={profileItems}
        onProfileSelect={(id: string, label?: string) => {
          if (id === "add-profile") {
            handleAddProfileClick()
          } else {
            handleProfileSelect(id, label)
          }
        }}
        onDelete={handleDeleteClick}
        className="min-h-[30vh] bg-transparent py-0 -mt-2"
      />

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Add New Profile</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewProfileName("")
                  setError("")
                }}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="profile-name" className="text-white">
                  Profile Name
                </Label>
                <Input
                  id="profile-name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  className="mt-2 bg-white/5 border-white/20 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateProfile()
                    }
                  }}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateProfile}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Create Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    setNewProfileName("")
                    setError("")
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Delete Profile</h2>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="text-white/70 hover:text-white"
                disabled={isDeleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-white/80 text-base">
                Are you sure you want to delete this profile?
              </p>
              <p className="text-white/60 text-sm">
                This action cannot be undone. All plans and progress data associated with this profile will be permanently deleted.
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
