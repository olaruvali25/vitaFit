"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
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
      {!isHomePage && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

