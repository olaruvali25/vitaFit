/**
 * Create Test User Script - Supabase version
 * 
 * Usage: npx tsx scripts/create-test-user.ts
 */

import { createClient } from '@supabase/supabase-js'

async function createTestUser() {
  const email = process.env.TEST_EMAIL || "test@vitafit.com"
  const password = process.env.TEST_PASSWORD || "test123!"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log("Creating test user...")
  console.log(`Email: ${email}`)

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log("✅ Test user already exists")
      } else {
        throw error
      }
    } else if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        phone: null,
        phone_verified: true,
        plan: 'free trial',
        profiles_limit: 1,
      }, { onConflict: 'id' })

      console.log("✅ Test user created successfully!")
    }

    console.log(`\nLogin with: ${email} / ${password}`)
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

createTestUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
