/**
 * Script to normalize all user emails in the database
 * Run with: npx tsx scripts/normalize-emails.ts
 */


// import { PrismaLibSql } from "@prisma/adapter-libsql" // Commented out - not used with Supabase

// Commented out - moving to Supabase, this script is no longer needed
// const databaseUrl = process.env.DATABASE_URL || "file:./dev.db"
// const adapter = new PrismaLibSql({ url: databaseUrl })

// const prisma = new PrismaClient({ adapter })

// Temporary placeholder to avoid build errors
const prisma = null as any

async function normalizeEmails() {
  console.log("Starting email normalization...")
  
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    console.log(`Found ${users.length} users to check`)

    let updated = 0
    let errors = 0

    for (const user of users) {
      const normalizedEmail = user.email.trim().toLowerCase()
      
      if (user.email !== normalizedEmail) {
        try {
          // Check if normalized email already exists
          const existing = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          })

          if (existing && existing.id !== user.id) {
            console.error(`⚠️  Cannot normalize ${user.email} → ${normalizedEmail} (email already exists for user ${existing.id})`)
            errors++
            continue
          }

          // Update to normalized email
          await prisma.user.update({
            where: { id: user.id },
            data: { email: normalizedEmail },
          })

          console.log(`✓ Normalized: ${user.email} → ${normalizedEmail} (${user.name || "No name"})`)
          updated++
        } catch (error: any) {
          console.error(`✗ Error normalizing ${user.email}:`, error.message)
          errors++
        }
      } else {
        console.log(`- Already normalized: ${user.email}`)
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log(`Normalization complete!`)
    console.log(`Updated: ${updated}`)
    console.log(`Errors: ${errors}`)
    console.log(`Skipped: ${users.length - updated - errors}`)
  } catch (error) {
    console.error("Fatal error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

normalizeEmails()

