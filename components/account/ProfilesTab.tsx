"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit2, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  age: number | null
  gender: string | null
  heightCm: number | null
  weightKg: number | null
  goal: string | null
  _count: {
    plans: number
  }
}

export function ProfilesTab() {
  const { data: session } = useSession()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    goal: "",
  })
  const [error, setError] = useState("")
  const [membershipInfo, setMembershipInfo] = useState<{
    currentCount: number
    limit: number
    canCreate: boolean
  } | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const [profilesRes, membershipRes] = await Promise.all([
        fetch("/api/profiles"),
        fetch("/api/membership"),
      ])

      if (profilesRes.ok) {
        const data = await profilesRes.json()
        setProfiles(data)
        
        // Update membership info after profiles are loaded
        if (membershipRes.ok) {
          const membership = await membershipRes.json()
          setMembershipInfo({
            currentCount: data.length,
            limit: membership.profileLimit || membership.profilesLimit,
            canCreate: membership.canCreateMore !== false,
          })
        }
      } else if (membershipRes.ok) {
        const membership = await membershipRes.json()
        setMembershipInfo({
          currentCount: 0,
          limit: membership.profileLimit || membership.profilesLimit,
          canCreate: membership.canCreateMore !== false,
        })
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    setError("")
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create profile")
        return
      }

      setShowCreateForm(false)
      setFormData({
        name: "",
        age: "",
        gender: "",
        heightCm: "",
        weightKg: "",
        goal: "",
      })
      fetchProfiles()
    } catch (err) {
      setError("Failed to create profile")
    }
  }

  const handleUpdate = async (id: string) => {
    setError("")
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to update profile")
        return
      }

      setEditingId(null)
      setFormData({
        name: "",
        age: "",
        gender: "",
        heightCm: "",
        weightKg: "",
        goal: "",
      })
      fetchProfiles()
    } catch (err) {
      setError("Failed to update profile")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return

    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProfiles()
      }
    } catch (err) {
      console.error("Failed to delete profile:", err)
    }
  }

  const startEdit = (profile: Profile) => {
    setEditingId(profile.id)
    setFormData({
      name: profile.name,
      age: profile.age?.toString() || "",
      gender: profile.gender || "",
      heightCm: profile.heightCm?.toString() || "",
      weightKg: profile.weightKg?.toString() || "",
      goal: profile.goal || "",
    })
  }

  if (loading) {
    return <div className="text-center py-8 text-white">Loading profiles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Profiles</h2>
          <p className="text-sm text-white/70 mt-1">
            {membershipInfo && (
              <>
                {membershipInfo.currentCount} / {membershipInfo.limit === Infinity ? "∞" : membershipInfo.limit} profiles
                {membershipInfo.limit !== Infinity && ` (${membershipInfo.limit - membershipInfo.currentCount} remaining)`}
              </>
            )}
          </p>
        </div>
        {membershipInfo?.canCreate && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Profile</CardTitle>
            <CardDescription>Add a new profile to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John, Me"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  placeholder="Male, Female, Other"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heightCm">Height (cm)</Label>
                <Input
                  id="heightCm"
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="Weight loss, Muscle gain"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-white/70" />
                  <CardTitle className="text-lg text-white">{profile.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(profile)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(profile.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === profile.id ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`edit-name-${profile.id}`}>Name</Label>
                    <Input
                      id={`edit-name-${profile.id}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(profile.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setFormData({
                          name: "",
                          age: "",
                          gender: "",
                          heightCm: "",
                          weightKg: "",
                          goal: "",
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-white">
                  {profile.age && <p>Age: {profile.age}</p>}
                  {profile.gender && <p>Gender: {profile.gender}</p>}
                  {profile.heightCm && <p>Height: {profile.heightCm} cm</p>}
                  {profile.weightKg && <p>Weight: {profile.weightKg} kg</p>}
                  {profile.goal && <p>Goal: {profile.goal}</p>}
                  <p className="text-white/70 mt-2">
                    {profile._count.plans} plan{profile._count.plans !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-white/70 mb-4" />
            <p className="text-white/70">No profiles yet. Create your first profile to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

