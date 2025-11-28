"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ButtonColorful } from "@/components/ui/button-colorful"
import { ProfilesTab } from "@/components/account/ProfilesTab"
import { PlansTab } from "@/components/account/PlansTab"
import { SubscriptionTab } from "@/components/account/SubscriptionTab"
import { ProgressTracker } from "@/components/account/ProgressTracker"
import { cn } from "@/lib/utils"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profiles")
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null)
  
  // Get profile name from URL params
  useEffect(() => {
    const profileName = searchParams.get("profileName")
    if (profileName) {
      setSelectedProfileName(profileName)
    }
  }, [searchParams])
  
  // If profileId is in URL and we're on profiles tab, switch to plans tab
  useEffect(() => {
    const profileId = searchParams.get("profileId")
    if (profileId && activeTab === "profiles") {
      setActiveTab("plans")
    }
  }, [searchParams, activeTab])

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            {selectedProfileName ? `${selectedProfileName}'s Account` : "My Account"}
          </h1>
          <p className="text-white/70">
            Manage your profiles, plans, and subscription
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Modern button navigation */}
          <div className="flex flex-wrap gap-4 mb-2">
            <ButtonColorful
              label="Profiles"
              onClick={() => setActiveTab("profiles")}
              className={cn(
                activeTab === "profiles" && "border-emerald-400 bg-emerald-500/10"
              )}
            />
            <ButtonColorful
              label="My Plans"
              onClick={() => setActiveTab("plans")}
              className={cn(
                activeTab === "plans" && "border-emerald-400 bg-emerald-500/10"
              )}
            />
            <ButtonColorful
              label="Subscription"
              onClick={() => setActiveTab("subscription")}
              className={cn(
                activeTab === "subscription" && "border-emerald-400 bg-emerald-500/10"
              )}
            />
          </div>

          <TabsContent value="profiles" className="mt-0">
            <ProfilesTab />
            {/* Progress Tracker - Only on Profiles tab */}
            <div className="mt-16 mb-16 w-full">
              <ProgressTracker />
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <PlansTab />
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <SubscriptionTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

