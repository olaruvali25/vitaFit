import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a password reset link has been sent" },
        { status: 200 }
      )
    }

    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        code: token,
        expiresAt,
      },
    })

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?code=${token}`

    if (process.env.NODE_ENV === "development") {
      console.log("Password reset link:", resetLink)
    }

    return NextResponse.json({ message: "Reset link sent" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
