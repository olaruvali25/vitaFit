import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk } from "@/lib/api-response"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  code: z.string().min(1),
  newPassword: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return jsonError("INVALID_INPUT", "Invalid reset payload.", 400)
  }
  const { code, newPassword } = parsed.data

  const reset = await prisma.passwordReset.findUnique({
    where: { code },
  })
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return jsonError("INVALID_RESET_CODE", "Reset code is invalid or expired.", 400)
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await prisma.$transaction(async (tx: any) => {
    await tx.user.update({
      where: { id: reset.userId },
      data: {
        passwordHash,
        tokenVersion: { increment: 1 },
      },
    })

    await tx.passwordReset.update({
      where: { code },
      data: { usedAt: new Date() },
    })
  })

  return jsonOk({ message: "Password reset successful. Please log in again." })
}
