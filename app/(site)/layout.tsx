"use client"

import { usePathname } from "next/navigation"
import { HeroHeader } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  
  return (
    <>
      {/* Use the same animated hero navbar on all non-home pages */}
      {!isHomePage && <HeroHeader />}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

