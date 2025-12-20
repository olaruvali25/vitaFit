import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Test route for creating users - uses Supabase Admin API

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not available in production" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, phone } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin not configured" }, { status: 500 })
    }

    // Create user via Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: phone || undefined,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create profile for user
    await supabaseAdmin.from('profiles').upsert({
      id: data.user.id,
      email,
      phone: phone || null,
      phone_verified: true,
      plan: 'free trial',
      profiles_limit: 1,
    }, { onConflict: 'id' })

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email }
    })
  } catch (error: any) {
    console.error("Create test user error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
