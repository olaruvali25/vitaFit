import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'test@vitafit.com'
  const password = 'test1234'
  const name = 'Test User'

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    console.log('User already exists:', email)
    console.log('Password:', password)
    return
  }

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

  console.log('✅ User created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('User ID:', user.id)

  // Initialize free trial
  const { initializeFreeTrial } = await import('../lib/membership')
  await initializeFreeTrial(user.id)
  console.log('✅ Free trial initialized')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

