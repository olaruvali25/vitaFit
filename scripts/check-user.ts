import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function checkUser() {
  const email = process.argv[2] || "valiolaru24@yahoo.com"
  const normalizedEmail = email.trim().toLowerCase()
  
  console.log(`\n=== Checking user: ${normalizedEmail} ===\n`)
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { membership: true },
    })
    
    if (!user) {
      console.log("❌ User NOT FOUND in database")
      console.log("Searching for similar emails...")
      
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
      })
      console.log("All users in database:", allUsers)
      return
    }
    
    console.log("✅ User FOUND:")
    console.log("  ID:", user.id)
    console.log("  Name:", user.name)
    console.log("  Email:", user.email)
    console.log("  Has passwordHash:", !!user.passwordHash)
    console.log("  PasswordHash length:", user.passwordHash?.length || 0)
    console.log("  Role:", user.role)
    console.log("  Has membership:", !!user.membership)
    
    if (user.passwordHash) {
      // Test password verification
      const testPassword = process.argv[3]
      if (testPassword) {
        console.log(`\n=== Testing password verification ===`)
        const isValid = await bcrypt.compare(testPassword, user.passwordHash)
        console.log(`Password "${testPassword}" is valid:`, isValid)
      }
    }
    
  } catch (error: any) {
    console.error("Error:", error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()

