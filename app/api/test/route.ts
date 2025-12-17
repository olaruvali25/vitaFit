import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL)
  console.log("NODE_ENV:", process.env.NODE_ENV)

  try {
    // Test database connection
    const userCount = await prisma.user.count()
    return NextResponse.json({
      success: true,
      userCount,
      database: "connected",
      DATABASE_URL: process.env.DATABASE_URL
    })
  } catch (error: any) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      database: "failed",
      DATABASE_URL: process.env.DATABASE_URL
    }, { status: 500 })
  }
}
