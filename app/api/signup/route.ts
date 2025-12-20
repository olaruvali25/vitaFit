import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type")
  return new NextResponse(null, { status: 200, headers })
}

export async function POST(req: NextRequest) {
  const headers = new Headers()
  headers.set("Content-Type", "application/json")
  headers.set("Access-Control-Allow-Origin", "*")
  
  // This legacy endpoint is deprecated
  // All signup should go through /api/supabase-auth/signup or Supabase client directly
  return NextResponse.json(
    { 
      error: "This endpoint is deprecated. Please use /api/supabase-auth/signup instead.",
      redirect: "/signup"
    },
    { status: 410, headers }
  )
}
