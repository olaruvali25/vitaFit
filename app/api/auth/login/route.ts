import { NextRequest, NextResponse } from "next/server"

// Legacy route - login is now handled directly via Supabase on the client
// See app/(site)/login/page.tsx for the Supabase login implementation

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint is deprecated. Use Supabase client-side authentication.",
      redirect: "/login"
    },
    { status: 410 }
  )
}
