import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { initializeFreeTrial } from "@/lib/membership"

// Ensure this route is public (no auth required)
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  console.log("[Signup] ====== SIGNUP REQUEST RECEIVED ======")
  console.log("[Signup] URL:", request.url)
  console.log("[Signup] Method:", request.method)
  console.log("[Signup] Headers:", Object.fromEntries(request.headers.entries()))
  
  try {
    let body
    try {
      body = await request.json()
      console.log("[Signup] Request body parsed:", { hasName: !!body.name, hasEmail: !!body.email, hasPassword: !!body.password })
    } catch (error) {
      console.error("[Signup] Failed to parse request body:", error)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Normalize email (trim and lowercase) to match auth.ts
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user already exists (using normalized email)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user with normalized email
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
    })

    // Initialize free trial
    try {
      await initializeFreeTrial(user.id)
      console.log("[Signup] Free trial initialized for user:", user.id)
    } catch (trialError) {
      console.error("[Signup] Failed to initialize free trial:", trialError)
      // Don't fail the signup if trial initialization fails
    }

    console.log("[Signup] User created successfully:", user.id)

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[Signup] Signup error:", error)
    console.error("[Signup] Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    return NextResponse.json(
      { 
        error: error?.message || "Failed to create account",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
