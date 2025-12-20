/**
 * Create Admin Script - Supabase version
 * 
 * Usage: npx tsx scripts/create-admin.ts
 * 
 * Environment variables:
 * - ADMIN_EMAIL (default: admin@vitafit.com)
 * - ADMIN_PASSWORD (default: admin123)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@vitafit.com"
  const password = process.env.ADMIN_PASSWORD || "admin123"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables")
    console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log("Creating admin user...")
  console.log(`Email: ${email}`)

  try {
    // Create user via Supabase Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'ADMIN' }
    })

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log("✅ Admin user already exists, updating role...")
        
        // Find user by email
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const existingUser = users.find(u => u.email === email)
        
        if (existingUser) {
          await supabase.auth.admin.updateUserById(existingUser.id, {
            user_metadata: { role: 'ADMIN' }
          })
          
          // Update profile
          await supabase.from('profiles').upsert({
            id: existingUser.id,
            email,
            plan: 'family',
            profiles_limit: 4,
          }, { onConflict: 'id' })
          
          console.log("✅ Updated existing user to ADMIN role")
        }
      } else {
        throw error
      }
    } else if (data.user) {
      // Create profile for admin
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        phone: null,
        phone_verified: true,
        plan: 'family',
        profiles_limit: 4,
      }, { onConflict: 'id' })

      console.log("✅ Admin user created successfully!")
    }

    console.log("\n🎉 Admin account ready!")
    console.log(`Login with: ${email} / ${password}`)
    console.log("\nYou now have:")
    console.log("- ADMIN role")
    console.log("- Family plan (4 profiles)")
  } catch (error: any) {
    console.error("❌ Error creating admin:", error.message)
    process.exit(1)
  }
}

createAdmin()
  .then(() => {
    console.log("\n✅ Script completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error)
    process.exit(1)
  })
