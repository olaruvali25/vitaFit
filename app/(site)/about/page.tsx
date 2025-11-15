"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Target, Brain, Heart, Users, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About VitaFit</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make personalized nutrition and fitness accessible to everyone, powered by AI.
          </p>
        </div>

        {/* Why VitaFit Exists */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Why VitaFit Exists</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We believe that everyone deserves access to personalized health and fitness guidance, regardless of their budget or location. Traditional personal trainers and nutritionists can be expensive and time-consuming, making them inaccessible to many people.
              </p>
              <p className="text-muted-foreground">
                VitaFit was born from the idea that AI technology could democratize personalized health coaching. By combining advanced algorithms with evidence-based nutrition and fitness science, we create custom plans that adapt to your unique needs, goals, and lifestyle.
              </p>
              <p className="text-muted-foreground">
                Our platform learns from your preferences, tracks your progress, and continuously refines your plan to ensure you stay motivated and achieve lasting results.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How the AI Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How Our AI Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your assessment data, including your goals, body composition, activity level, dietary preferences, and schedule constraints.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Plan Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Using machine learning algorithms trained on thousands of successful transformations, we generate personalized meal plans and workout routines tailored to you.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Continuous Adaptation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your plan evolves weekly based on your progress, feedback, and changing goals, ensuring you stay on track and motivated.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Personalized Nutrition Matters */}
        <section className="mb-16">
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Why Personalized Nutrition Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                One-size-fits-all diets don't work because every person is unique. Your metabolism, activity level, food preferences, allergies, schedule, and goals all play a crucial role in determining what nutrition plan will work best for you.
              </p>
              <p className="text-muted-foreground">
                Personalized nutrition considers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your body composition and metabolic rate</li>
                <li>Your activity level and workout schedule</li>
                <li>Your dietary preferences and restrictions</li>
                <li>Your lifestyle and time constraints</li>
                <li>Your specific health and fitness goals</li>
              </ul>
              <p className="text-muted-foreground">
                By tailoring your meal plan to these factors, you're more likely to stick with it, see results faster, and maintain your progress long-term.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <Card className="bg-muted/50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="h-10 w-10 text-primary" />
                <CardTitle className="text-3xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To empower millions of people worldwide to achieve their health and fitness goals through accessible, personalized, and evidence-based AI-powered nutrition and fitness guidance.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="text-sm py-2 px-4">
                  Evidence-Based
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  Personalized
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  Accessible
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  Sustainable
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is the AI really personalized?</AccordionTrigger>
              <AccordionContent>
                Yes! Our AI analyzes your unique assessment data, preferences, and progress to create truly personalized plans. No two members receive the same meal plan or workout routine.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How often does my plan update?</AccordionTrigger>
              <AccordionContent>
                Your plan updates weekly based on your progress, feedback, and any changes to your goals or preferences. This ensures you're always working with a plan that's optimized for your current situation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What makes VitaFit different from other fitness apps?</AccordionTrigger>
              <AccordionContent>
                Unlike generic fitness apps, VitaFit uses AI to create truly personalized plans that adapt to you. We combine meal planning and workouts in one platform, and our plans evolve based on your progress and feedback.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is the nutrition advice evidence-based?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Our AI is trained on evidence-based nutrition and fitness science. All recommendations align with current research and best practices from registered dietitians and certified fitness professionals.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Founder Section (Placeholder) */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Team</CardTitle>
              <CardDescription>Meet the people behind VitaFit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="h-32 w-32 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Founder & CEO</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Passionate about making personalized health guidance accessible to everyone through technology.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 w-32 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Brain className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">AI & Product Team</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A dedicated team of engineers, data scientists, and nutrition experts working to improve your experience every day.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of members transforming their health with VitaFit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link href="/assessment">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

