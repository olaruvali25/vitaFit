"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: In production, this would send data to backend
    console.log("Contact form submitted:", formData)
    alert("Thank you for your message! We'll get back to you within 24 hours.")
    setFormData({ name: "", email: "", message: "" })
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="relative w-full py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40">
      {/* Page-specific light background overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 via-emerald-100/50 to-white/90" />
      <div className="container px-4 relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-emerald-600">Have Questions? We're Here to Help.</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-xl border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="text-gray-900">Contact Information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900">Email</h3>
                      <p className="text-sm text-gray-600">
                        support@vitafit.com
                      </p>
                      <p className="text-sm text-gray-600">
                        hello@vitafit.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900">Response Time</h3>
                      <p className="text-sm text-gray-600">
                        We typically respond within 24 hours during business days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-xl border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="text-gray-900">Common Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-gray-900">Account & Billing</h4>
                    <p className="text-xs text-gray-600">
                      For questions about your account, subscription, or billing, please include your email address in your message.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-gray-900">Technical Support</h4>
                    <p className="text-xs text-gray-600">
                      Experiencing technical issues? Describe the problem and we'll help you resolve it quickly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-gray-900">Partnerships</h4>
                    <p className="text-xs text-gray-600">
                      Interested in partnering with us? We'd love to hear your ideas and explore opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="bg-white/60 backdrop-blur-xl border-emerald-200/50">
              <CardHeader>
                <CardTitle className="text-gray-900">Send us a Message</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll get back to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="bg-white/50 border-emerald-100 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="bg-white/50 border-emerald-100 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={6}
                      required
                      className="bg-white/50 border-emerald-100 focus:border-emerald-500 resize-none"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="bg-emerald-50/50 border-emerald-100">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">
                  For urgent matters, please email us directly at{" "}
                  <a href="mailto:support@vitafit.com" className="text-emerald-600 hover:underline font-medium">
                    support@vitafit.com
                  </a>
                  . We're here to help!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
  )
}

