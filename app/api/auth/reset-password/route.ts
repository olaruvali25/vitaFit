import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json(
        { message: "If an account exists, a password reset link has been sent" },
        { status: 200 }
      )
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // Token expires in 1 hour

    // Store reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    })

    // In production, send email with reset link
    // For now, we'll return the token in development
    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`

    if (process.env.NODE_ENV === "development") {
      console.log("Password reset link:", resetLink)
    }

    return NextResponse.json(
      { 
        message: "If an account exists, a password reset link has been sent",
        // Only include in development
        ...(process.env.NODE_ENV === "development" && { resetLink }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 }
    )
  }
}

