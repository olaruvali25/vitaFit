"use client"

import { useEffect, useState, Suspense } from "react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { useRouter } from "next/navigation"
import { redirect, useSearchParams } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ButtonColorful } from "@/components/ui/button-colorful"
import { ProfilesTab } from "@/components/account/ProfilesTab"
import { PlansTab } from "@/components/account/PlansTab"
import { SubscriptionTab } from "@/components/account/SubscriptionTab"
import { ProgressTracker } from "@/components/account/ProgressTracker"
import { cn } from "@/lib/utils"

function AccountPageContent() {
  const { user, loading, session } = useSupabase()
  const status = loading ? "loading" : user ? "authenticated" : "unauthenticated"
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profiles")
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null)
  
  // Get profile name from URL params
  useEffect(() => {
    const profileName = searchParams.get("profileName")
    if (profileName) {
      setSelectedProfileName(profileName)
    } else {
      // Clear profile name if not in URL
      setSelectedProfileName(null)
    }
  }, [searchParams])

  const router = useRouter()
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-green-950/20 to-black min-h-screen">
      {/* Green gradient background layers */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18c260]/[0.08] via-green-500/[0.05] to-[#18c260]/[0.08]"></div>
      </div>
      
      <div className="container px-4 py-16 md:py-24 relative z-10">
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
    </section>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center text-white">Loading...</div>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  )
}

