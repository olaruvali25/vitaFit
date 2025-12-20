import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"

// Plan day progress - stub implementation
// Full implementation requires plans table in Supabase

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string }> }
) {
  try {
    await requireAuth()
    const { planId, dayId } = await params
    
    return NextResponse.json(
      { error: "Plan storage is being migrated to Supabase" },
      { status: 503 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.statusCode || 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string }> }
) {
  try {
    await requireAuth()
    const { planId, dayId } = await params
    
    return NextResponse.json(
      { error: "Plan storage is being migrated to Supabase" },
      { status: 503 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.statusCode || 500 }
    )
  }
}
