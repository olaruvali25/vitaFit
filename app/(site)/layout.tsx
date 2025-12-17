 "use client"

import { usePathname } from "next/navigation"
import { HeroHeader } from "@/components/header"
import { Footer } from "@/components/footer"
import { SupabaseProvider } from "@/components/providers/SupabaseProvider"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  
  return (
    <div suppressHydrationWarning>
      <SupabaseProvider>
        {/* Use the same animated hero navbar on all non-home pages */}
        {!isHomePage && <HeroHeader />}
        <main className="flex-1 bg-gradient-to-br from-black via-green-950/20 to-black">{children}</main>
        <Footer />
      </SupabaseProvider>
    </div>
  )
}

