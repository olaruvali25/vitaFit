"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

export default function AssessmentPage() {
  const [formData, setFormData] = useState({
    goal: "",
    timeline: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    dietaryPreferences: "",
    foodAllergies: "",
    scheduleConstraints: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: In production, this would send data to backend
    console.log("Form submitted:", formData)
    alert("Assessment submitted! Your personalized plan will be generated shortly.")
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Create Your Personalized Plan</h1>
          <p className="text-lg text-muted-foreground">
            Tell us about yourself and your goals. Our AI will create a custom meal plan and workout routine just for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Goal & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>What do you want to achieve?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => handleChange("goal", e.target.value)}
                  required
                >
                  <option value="">Select your goal</option>
                  <option value="lose">Lose Weight</option>
                  <option value="build">Build Muscle</option>
                  <option value="maintain">Maintain Current Weight</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleChange("timeline", e.target.value)}
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="flexible">Flexible</option>
                  <option value="4">4 weeks</option>
                  <option value="8">8 weeks</option>
                  <option value="12">12 weeks</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Help us understand your body composition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="100"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="100"
                    max="250"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="30"
                    max="300"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle>Activity & Lifestyle</CardTitle>
              <CardDescription>How active are you in your daily life?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  id="activityLevel"
                  value={formData.activityLevel}
                  onChange={(e) => handleChange("activityLevel", e.target.value)}
                  required
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="athlete">Athlete (intense training 2x/day)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleConstraints">Preferred Workout Time</Label>
                <Select
                  id="scheduleConstraints"
                  value={formData.scheduleConstraints}
                  onChange={(e) => handleChange("scheduleConstraints", e.target.value)}
                  required
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning</option>
                  <option value="noon">Noon</option>
                  <option value="evening">Evening</option>
                  <option value="flexible">Flexible</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dietary Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Dietary Preferences</CardTitle>
              <CardDescription>Tell us about your eating habits and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dietaryPreferences">Dietary Preference</Label>
                <Select
                  id="dietaryPreferences"
                  value={formData.dietaryPreferences}
                  onChange={(e) => handleChange("dietaryPreferences", e.target.value)}
                  required
                >
                  <option value="">Select preference</option>
                  <option value="normal">Normal / Balanced</option>
                  <option value="high-protein">High Protein</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="foodAllergies">Food Allergies or Intolerances</Label>
                <Textarea
                  id="foodAllergies"
                  placeholder="List any food allergies or intolerances (e.g., nuts, dairy, gluten). Leave blank if none."
                  value={formData.foodAllergies}
                  onChange={(e) => handleChange("foodAllergies", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Where should we send your personalized plan?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" size="lg" className="flex-1">
              Generate My Plan
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

