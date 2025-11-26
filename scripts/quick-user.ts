import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'admin@vitafit.com'
  const password = 'admin123'
  const name = 'Admin User'

  // Delete if exists
  await prisma.user.deleteMany({ where: { email } }).catch(() => {})

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'ADMIN',
    }
  })

  console.log('✅ USER CREATED!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('Login at: http://localhost:3000/login')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

