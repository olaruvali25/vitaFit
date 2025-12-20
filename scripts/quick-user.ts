/**
 * Quick User Creation Script - Supabase version
 * 
 * Usage: npx tsx scripts/quick-user.ts
 */

import { createClient } from '@supabase/supabase-js'

async function quickUser() {
  const email = `test${Date.now()}@vitafit.com`
  const password = "test123!"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log("Creating quick test user...")

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        phone: null,
        phone_verified: true,
        plan: 'free trial',
        profiles_limit: 1,
      }, { onConflict: 'id' })
    }

    console.log("✅ User created!")
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

quickUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
