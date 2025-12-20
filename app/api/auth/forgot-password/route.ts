import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { z } from "zod"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = schema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ message: "If the email exists, a reset link was sent." })
    }

    const email = parsed.data.email.trim().toLowerCase()

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    })

    return NextResponse.json({ message: "If the email exists, a reset link was sent." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "If the email exists, a reset link was sent." })
  }
}
