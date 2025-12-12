import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/authz"
import { jsonError, jsonOk } from "@/lib/api-response"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthContext(req)
  if (auth.error) return auth.error
  const { user } = auth
  const { id: profileId } = await params


  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.id },
  })
  if (!profile) {
    return jsonError("NOT_FOUND", "Profile not found.", 404)
  }

  const count = await prisma.profile.count({ where: { userId: user.id } })
  if (count <= 1) {
    return jsonError("MIN_PROFILE_VIOLATION", "You must keep at least one profile.", 400)
  }

  await prisma.profile.delete({ where: { id: profileId } })

  return jsonOk({ message: "Profile deleted." })
}

