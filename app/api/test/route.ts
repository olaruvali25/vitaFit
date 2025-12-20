import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("NODE_ENV:", process.env.NODE_ENV)

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: "Supabase admin client not configured",
        database: "not configured"
      }, { status: 500 })
    }

    // Test database connection via Supabase
    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      profileCount: count,
      database: "connected",
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
    })
  } catch (error: any) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      database: "failed"
    }, { status: 500 })
  }
}
