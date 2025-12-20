import { NextRequest, NextResponse } from "next/server"

// Legacy route - redirects to new /api/profiles endpoint
// This route used Prisma and is now deprecated

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/profiles instead." },
    { status: 410 }
  )
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/profiles instead." },
    { status: 410 }
  )
}
