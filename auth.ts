/**
 * Auth.js (NextAuth v5) Configuration
 * 
 * REQUIRED ENVIRONMENT VARIABLES (.env.local):
 * 
 * AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
 * AUTH_URL=http://localhost:3000
 * AUTH_TRUST_HOST=true
 * 
 * To generate AUTH_SECRET:
 * openssl rand -base64 32
 * 
 * Or use: https://generate-secret.vercel.app/32
 */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[Auth] Missing email or password")
          return null
        }

        try {
          const emailInput = (credentials.email as string).trim()
          const normalizedEmail = emailInput.toLowerCase()
          const passwordInput = credentials.password as string
          
          console.log("[Auth] ====== AUTHORIZATION ATTEMPT ======")
          console.log("[Auth] Email input:", emailInput)
          console.log("[Auth] Normalized email:", normalizedEmail)
          console.log("[Auth] Password provided:", passwordInput ? "YES (length: " + passwordInput.length + ")" : "NO")
          
          // Try normalized email first (new standard)
          let user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
          })

          // If not found, try original email (for existing users created before normalization)
          if (!user) {
            console.log("[Auth] User not found with normalized email, trying original:", emailInput)
            user = await prisma.user.findUnique({
              where: { email: emailInput }
            })
            
            // If found with original email, update to normalized for consistency
            if (user && user.email !== normalizedEmail) {
              console.log("[Auth] Updating user email to normalized format:", user.id)
              try {
                await prisma.user.update({
                  where: { id: user.id },
                  data: { email: normalizedEmail }
                })
                user.email = normalizedEmail
              } catch (updateError) {
                console.error("[Auth] Failed to normalize email (might be duplicate):", updateError)
                // Continue with original email if update fails
              }
            }
          }

          if (!user) {
            console.error("[Auth] ❌ User not found with email:", emailInput, "or", normalizedEmail)
            return null
          }

          console.log("[Auth] ✅ User found:", { id: user.id, email: user.email, name: user.name })

          if (!user.passwordHash) {
            console.error("[Auth] ❌ User has no password hash:", user.id)
            return null
          }

          console.log("[Auth] Password hash exists, length:", user.passwordHash.length)
          console.log("[Auth] Password hash preview:", user.passwordHash.substring(0, 20) + "...")
          console.log("[Auth] Comparing password...")
          console.log("[Auth] Password input type:", typeof passwordInput)
          console.log("[Auth] Password input length:", passwordInput.length)
          console.log("[Auth] Password input preview (first 3 chars):", passwordInput.substring(0, 3) + "...")
          
          const isPasswordValid = await bcrypt.compare(
            passwordInput,
            user.passwordHash
          )

          console.log("[Auth] Password comparison result:", isPasswordValid)
          
          if (!isPasswordValid) {
            // Try with trimmed password in case there are whitespace issues
            const trimmedPassword = passwordInput.trim()
            if (trimmedPassword !== passwordInput) {
              console.log("[Auth] Password had whitespace, trying trimmed version...")
              const isTrimmedValid = await bcrypt.compare(trimmedPassword, user.passwordHash)
              console.log("[Auth] Trimmed password comparison result:", isTrimmedValid)
            }
          }

          if (!isPasswordValid) {
            console.error("[Auth] ❌ Invalid password for user:", user.id)
            console.error("[Auth] Password provided length:", passwordInput.length)
            console.error("[Auth] Password hash length:", user.passwordHash.length)
            return null
          }

          console.log("[Auth] ✅ User authorized successfully:", user.id)
          console.log("[Auth] ====== AUTHORIZATION SUCCESS ======")
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error: any) {
          console.error("[Auth] Authorization error:", error)
          console.error("[Auth] Error details:", {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
            code: error?.code,
          })
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        ;(session.user as any).role = token.role as UserRole
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
})

