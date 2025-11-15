"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Mitchell",
    goal: "Lost 15kg in 3 months",
    rating: 5,
    review: "VitaFit changed my life! The meal plans are delicious and the workouts fit perfectly into my busy schedule. I've lost 15kg and feel more energetic than ever. The AI really understands my preferences and adapts weekly.",
    avatar: "SM",
    beforeAfter: true,
  },
  {
    name: "Mike Thompson",
    goal: "Built muscle, gained strength",
    rating: 5,
    review: "As someone new to fitness, the personalized guidance made all the difference. I feel stronger and more confident! The workout plans are challenging but achievable, and the meal plans help me fuel my body properly.",
    avatar: "MT",
    beforeAfter: false,
  },
  {
    name: "Emma Lawson",
    goal: "Maintained healthy lifestyle",
    rating: 5,
    review: "The weekly updates keep me accountable and the variety in meals means I never get bored. Highly recommend! I've been using VitaFit for 6 months and it's become an essential part of my routine.",
    avatar: "EL",
    beforeAfter: false,
  },
  {
    name: "David Chen",
    goal: "Lost 20kg, improved health",
    rating: 5,
    review: "After trying multiple diets and fitness apps, VitaFit finally worked for me. The AI creates plans that actually fit my lifestyle. I've lost 20kg and my doctor is thrilled with my improved health markers.",
    avatar: "DC",
    beforeAfter: true,
  },
  {
    name: "Jessica Rodriguez",
    goal: "Gained muscle, improved endurance",
    rating: 5,
    review: "I love how the plans adapt to my progress. The workouts are varied and keep me motivated. The meal plans are family-friendly too, which makes meal prep so much easier. Best investment I've made in my health!",
    avatar: "JR",
    beforeAfter: false,
  },
  {
    name: "James Wilson",
    goal: "Lost 12kg, gained confidence",
    rating: 5,
    review: "The motivational support and reminders are game-changers. I never feel alone on this journey. The personalized approach means I'm not following generic advice - it's tailored to me. Couldn't be happier!",
    avatar: "JW",
    beforeAfter: false,
  },
]

export default function ReviewsPage() {
  return (
    <div className="container px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">What Our Members Say</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who transformed their health with VitaFit
          </p>
        </div>

        {/* Before/After Placeholder Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Transformation Stories</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sarah's Journey</CardTitle>
                <CardDescription>Lost 15kg in 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Before</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">Before</p>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary">
                      <span className="text-sm text-primary font-medium">After</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">After</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "VitaFit's personalized approach helped me achieve results I never thought possible. The meal plans were delicious and the workouts were perfectly tailored to my fitness level."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>David's Transformation</CardTitle>
                <CardDescription>Lost 20kg, improved health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Before</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">Before</p>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary">
                      <span className="text-sm text-primary font-medium">After</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">After</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "After years of struggling with my weight, VitaFit finally provided a sustainable solution. The AI adapts to my needs and keeps me motivated every step of the way."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Member Reviews</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {testimonial.goal}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Transformation?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of members achieving their health and fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="text-sm py-2 px-4">
                  ⭐ 4.9/5 average rating
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  👥 10,000+ active members
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  ✅ 7-day money-back guarantee
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

