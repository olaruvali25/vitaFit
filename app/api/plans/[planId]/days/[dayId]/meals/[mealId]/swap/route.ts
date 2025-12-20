import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"

// Meal swap route - stub implementation
// Full implementation requires plans table in Supabase

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string; mealId: string }> }
) {
  try {
    await requireAuth()
    
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
