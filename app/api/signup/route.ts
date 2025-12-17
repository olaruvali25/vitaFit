import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { initializeFreeTrial } from "@/lib/membership"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type")
  return new NextResponse(null, { status: 200, headers })
}

export async function POST(req: NextRequest) {
  const headers = new Headers()
  headers.set("Content-Type", "application/json")
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type")
  
  try {
    let body
    try {
      body = await req.json()
      console.log("[Signup] Request body parsed:", { hasName: !!body.name, hasEmail: !!body.email, hasPassword: !!body.password })
    } catch (error) {
      console.error("[Signup] Failed to parse request body:", error)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers }
      )
    }

    const { name, email, password } = body

    if (!name || !email || !password) {
      console.error("[Signup] Missing required fields:", { hasName: !!name, hasEmail: !!email, hasPassword: !!password })
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400, headers }
      )
    }

    if (password.length < 8) {
      console.error("[Signup] Password too short:", password.length)
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400, headers }
      )
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      console.error("[Signup] Password missing number:", password)
      return NextResponse.json(
        { error: "Password must contain at least one number" },
        { status: 400, headers }
      )
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      console.error("[Signup] Password missing special character:", password)
      return NextResponse.json(
        { error: "Password must contain at least one special character (!@#$%^&* etc.)" },
        { status: 400, headers }
      )
    }

    // Normalize email (trim and lowercase) to match auth.ts
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user already exists (using normalized email)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      console.error("[Signup] User already exists:", normalizedEmail)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400, headers }
      )
    }

    // NOTE: This signup API is for legacy local authentication
    // Supabase handles user creation and authentication now
    // This endpoint should be removed or updated for Supabase auth

    console.log("[Signup] Legacy signup attempted - should use Supabase auth instead")

    return NextResponse.json(
      { error: "Please use Supabase authentication" },
      { status: 400, headers }
    )
  } catch (error: any) {
    console.error("[Signup] Signup error:", error)
    console.error("[Signup] Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
    })
    return NextResponse.json(
      { 
        error: error?.message || "Failed to create account",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500, headers }
    )
  }
}
