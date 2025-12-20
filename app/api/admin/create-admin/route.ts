import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Admin creation route - uses Supabase Admin API

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with admin secret
    const adminSecret = request.headers.get("x-admin-secret")
    if (process.env.NODE_ENV === "production" && adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin not configured" }, { status: 500 })
    }

    // Create admin user via Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'ADMIN' }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create profile for admin with family plan
    await supabaseAdmin.from('profiles').upsert({
      id: data.user.id,
      email,
      phone: null,
      phone_verified: true,
      plan: 'family',
      profiles_limit: 4,
    }, { onConflict: 'id' })

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      user: { id: data.user.id, email: data.user.email }
    })
  } catch (error: any) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
