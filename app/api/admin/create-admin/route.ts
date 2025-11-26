import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with a secret key
    if (process.env.NODE_ENV === "production" && request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const email = body.email || "admin@vitafit.com"
    const password = body.password || "admin123"
    const name = body.name || "Admin User"

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Update to admin if not already
      if (existingUser.role !== "ADMIN") {
        await prisma.user.update({
          where: { email },
          data: { role: "ADMIN" },
        })
      }
      
      // Update password
      const passwordHash = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { email },
        data: { passwordHash },
      })
      
      return NextResponse.json({
        message: "Admin account updated",
        email,
        password,
        role: "ADMIN",
      })
    }

    // Create new admin user
    const passwordHash = await bcrypt.hash(password, 12)

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "ADMIN",
        hasUsedFreeTrial: true,
      },
    })

    // Create active membership for admin
    await prisma.membership.create({
      data: {
        userId: admin.id,
        plan: "FAMILY",
        status: "ACTIVE",
      },
    })

    return NextResponse.json({
      message: "Admin account created successfully",
      email,
      password,
      role: "ADMIN",
      membership: "FAMILY - ACTIVE",
    })
  } catch (error: any) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create admin" },
      { status: 500 }
    )
  }
}

