"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfilesTab } from "@/components/account/ProfilesTab"
import { PlansTab } from "@/components/account/PlansTab"
import { SubscriptionTab } from "@/components/account/SubscriptionTab"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("profiles")

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
          <h1 className="text-3xl font-bold mb-2 text-white">My Account</h1>
          <p className="text-white/70">
            Manage your profiles, plans, and subscription
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-6">
            <ProfilesTab />
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

