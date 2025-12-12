import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonOk } from "@/lib/api-response"
import { sendResetEmail } from "@/lib/send-reset-email"
import { z } from "zod"
import crypto from "crypto"

const schema = z.object({
  email: z.string().email(),
})

function generateResetCode() {
  return crypto.randomInt(100000, 999999).toString()
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return jsonOk({ message: "If the email exists, a reset code was sent." })
  }
  const email = parsed.data.email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const code = generateResetCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    })
    await sendResetEmail(email, code)
  }

  // Always return generic success
  return jsonOk({ message: "If the email exists, a reset code was sent." })
}

