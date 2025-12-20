import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"

// Note: This route previously used Prisma for plan storage
// Plan storage needs to be implemented in Supabase with appropriate tables

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const user = await requireAuth()
    const { planId } = await params

    // Plan storage in Supabase not yet implemented
    // Return a placeholder response
    console.log(`[API Plans] GET plan ${planId} for user ${user.id}`)
    
    return NextResponse.json(
      { error: "Plan storage is being migrated to Supabase. Please try again later." },
      { status: 503 }
    )
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Get plan error:", error)
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const user = await requireAuth()
    const { planId } = await params

    console.log(`[API Plans] DELETE plan ${planId} for user ${user.id}`)
    
    return NextResponse.json(
      { error: "Plan storage is being migrated to Supabase. Please try again later." },
      { status: 503 }
    )
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Delete plan error:", error)
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
  }
}
