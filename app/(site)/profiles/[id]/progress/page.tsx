"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TrendingUp, Calendar, Weight, Dumbbell, UtensilsCrossed } from "lucide-react"

interface ProgressEntry {
  id: string
  date: string
  weightKg: number | null
  workoutsCompleted: number | null
  mealsCompleted: number | null
  notes: string | null
}

interface Profile {
  id: string
  name: string
}

export default function ProgressPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const profileId = params.id as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    weightKg: "",
    workoutsCompleted: "",
    mealsCompleted: "",
    notes: "",
  })

  useEffect(() => {
    if (profileId) {
      fetchData()
    }
  }, [profileId])

  const fetchData = async () => {
    try {
      const [profileRes, progressRes] = await Promise.all([
        fetch(`/api/profiles/${profileId}`),
        fetch(`/api/profiles/${profileId}/progress?limit=100`),
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setEntries(progressData.sort((a: ProgressEntry, b: ProgressEntry) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      }
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/profiles/${profileId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          date: new Date().toISOString().split("T")[0],
          weightKg: "",
          workoutsCompleted: "",
          mealsCompleted: "",
          notes: "",
        })
        fetchData()
      }
    } catch (err) {
      console.error("Failed to save progress:", err)
    }
  }

  // Calculate stats
  const weightEntries = entries.filter((e) => e.weightKg !== null)
  const latestWeight = weightEntries[0]?.weightKg
  const previousWeight = weightEntries[1]?.weightKg
  const weightChange = latestWeight && previousWeight ? latestWeight - previousWeight : null

  const totalWorkouts = entries.reduce((sum, e) => sum + (e.workoutsCompleted || 0), 0)
  const totalMeals = entries.reduce((sum, e) => sum + (e.mealsCompleted || 0), 0)
  const avgWorkoutsPerWeek = entries.length > 0 ? (totalWorkouts / entries.length) * 7 : 0
  const avgMealsPerWeek = entries.length > 0 ? (totalMeals / entries.length) * 7 : 0

  if (loading) {
    return (
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Progress Tracking - {profile?.name}
          </h1>
          <p className="text-white/70">
            Track your weight, workouts, and meal compliance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-lg text-white">Current Weight</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {latestWeight ? `${latestWeight.toFixed(1)} kg` : "—"}
              </div>
              {weightChange !== null && (
                <div className={`text-sm mt-1 ${weightChange > 0 ? "text-red-500" : "text-emerald-500"}`}>
                  {weightChange > 0 ? "+" : ""}
                  {weightChange.toFixed(1)} kg
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-lg">Workouts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalWorkouts}</div>
              <div className="text-sm text-white/70 mt-1">
                ~{avgWorkoutsPerWeek.toFixed(1)} per week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-lg">Meals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalMeals}</div>
              <div className="text-sm text-white/70 mt-1">
                ~{avgMealsPerWeek.toFixed(1)} per week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Entry Form */}
        {showForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Progress Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightKg">Weight (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      step="0.1"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workoutsCompleted">Workouts Completed</Label>
                    <Input
                      id="workoutsCompleted"
                      type="number"
                      value={formData.workoutsCompleted}
                      onChange={(e) => setFormData({ ...formData, workoutsCompleted: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mealsCompleted">Meals Completed</Label>
                    <Input
                      id="mealsCompleted"
                      type="number"
                      value={formData.mealsCompleted}
                      onChange={(e) => setFormData({ ...formData, mealsCompleted: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save Entry</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setShowForm(true)} className="mb-6">
            Add Progress Entry
          </Button>
        )}

        {/* Progress Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-white/70 mb-4" />
                <p className="text-white/70">No progress entries yet. Start tracking your journey!</p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-white/70" />
                      <div>
                        <p className="font-semibold text-white">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-white/70">
                          {entry.weightKg && (
                            <span>Weight: {entry.weightKg.toFixed(1)} kg</span>
                          )}
                          {entry.workoutsCompleted !== null && (
                            <span>Workouts: {entry.workoutsCompleted}</span>
                          )}
                          {entry.mealsCompleted !== null && (
                            <span>Meals: {entry.mealsCompleted}</span>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-sm mt-2 text-white/70">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

