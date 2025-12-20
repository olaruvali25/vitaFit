import { NextRequest, NextResponse } from "next/server"

// Legacy route - use /api/profiles/[id] instead
// This route used Prisma and is now deprecated

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/profiles/[id] instead." },
    { status: 410 }
  )
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/profiles/[id] instead." },
    { status: 410 }
  )
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/profiles/[id] instead." },
    { status: 410 }
  )
}
