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
          
          // Temporarily disabled for Supabase transition
          console.log("[Auth] NextAuth authentication disabled - using Supabase instead")
            return null
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
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
})

