"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, UtensilsCrossed, Calendar, Heart, Star, CheckCircle2 } from "lucide-react"
import HeroSection from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Integrated Assessment Form */}
      <HeroSection />

      {/* Features Showcase */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <UtensilsCrossed className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Personalized Meal Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Weekly meal plans tailored to your dietary preferences, allergies, and nutritional goals.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Dumbbell className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Personalized Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Custom workout routines that fit your schedule, fitness level, and equipment availability.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Weekly Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your plan adapts weekly based on your progress and feedback, keeping you on track.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Motivational Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get encouragement, tips, and reminders to help you stay motivated throughout your journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="container px-4 py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Loved by Thousands</h2>
            <p className="text-muted-foreground">
              See what our members are saying about their transformations
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-lg">Sarah M.</CardTitle>
                <CardDescription>Lost 15kg in 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "VitaFit changed my life! The meal plans are delicious and the workouts fit perfectly into my busy schedule."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-lg">Mike T.</CardTitle>
                <CardDescription>Built muscle, gained strength</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "As someone new to fitness, the personalized guidance made all the difference. I feel stronger and more confident!"
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-lg">Emma L.</CardTitle>
                <CardDescription>Maintained healthy lifestyle</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The weekly updates keep me accountable and the variety in meals means I never get bored. Highly recommend!"
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/reviews">Read More Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <Card className="border-primary bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl">
                Start Your Transformation Today
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of members achieving their health and fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">7-day money-back guarantee</span>
                </div>
              </div>
              <Button size="lg" asChild className="mt-6">
                <Link href="/assessment">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

