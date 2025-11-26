import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@vitafit.com"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const name = process.env.ADMIN_NAME || "Admin User"

  console.log("Creating admin user...")
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Update to admin if not already
      if (existingUser.role !== "ADMIN") {
        await prisma.user.update({
          where: { email },
          data: { role: "ADMIN" },
        })
        console.log("✅ Updated existing user to ADMIN role")
      } else {
        console.log("✅ Admin user already exists")
      }
      
      // Update password
      const passwordHash = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { email },
        data: { passwordHash },
      })
      console.log("✅ Password updated")
      
      console.log("\n🎉 Admin account ready!")
      console.log(`Login with: ${email} / ${password}`)
      return
    }

    // Create new admin user
    const passwordHash = await bcrypt.hash(password, 12)

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "ADMIN",
        hasUsedFreeTrial: true, // Admin doesn't need trial
      },
    })

    // Create active membership for admin
    await prisma.membership.create({
      data: {
        userId: admin.id,
        plan: "FAMILY", // Highest tier
        status: "ACTIVE",
      },
    })

    console.log("✅ Admin user created successfully!")
    console.log("\n🎉 Admin account ready!")
    console.log(`Login with: ${email} / ${password}`)
    console.log("\nYou now have:")
    console.log("- ADMIN role (unlimited profiles & plans)")
    console.log("- Active FAMILY membership")
  } catch (error) {
    console.error("❌ Error creating admin:", error)
    throw error
  } finally {
    await prisma.$disconnect()
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
