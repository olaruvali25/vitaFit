import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { initializeFreeTrial } from "@/lib/membership"

export async function POST(request: NextRequest) {
  try {
    const email = "admin@vitafit.com"
    const password = "admin123"
    const name = "Admin User"

    // Delete if exists
    await prisma.user.deleteMany({ where: { email } }).catch(() => {})

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    })

    // Initialize free trial
    try {
      await initializeFreeTrial(user.id)
    } catch (e) {
      console.error("Trial init error:", e)
    }

    return NextResponse.json({
      success: true,
      message: "User created!",
      email,
      password,
      userId: user.id,
    })
  } catch (error: any) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create user" },
      { status: 500 }
    )
  }
}

