import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { supabaseAdmin } from "@/lib/supabase"

// Note: Plans are now stored differently - this is a stub implementation
// Full plan storage in Supabase would require additional tables

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get("profileId")

    // For now, return empty array as plan storage needs to be implemented in Supabase
    // This prevents the old Prisma-based queries from failing
    console.log(`[API Plans GET] Returning empty plans for user ${user.id}`)
    
    return NextResponse.json([])
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Get plans error:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { profileId, title } = body

    if (!profileId || !title) {
      return NextResponse.json(
        { error: "Profile ID and title are required" },
        { status: 400 }
      )
    }

    // Verify profile belongs to user
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('app_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Plan creation would go here with proper Supabase tables
    // For now, return a stub response
    return NextResponse.json({
      id: crypto.randomUUID(),
      profileId,
      title,
      createdAt: new Date().toISOString(),
      message: "Plan creation stub - full implementation requires Supabase plans table"
    }, { status: 201 })
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Create plan error:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}
