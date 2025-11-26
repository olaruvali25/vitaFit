/**
 * Prisma Client Singleton
 * 
 * This file exports a single, shared Prisma Client instance.
 * In development, it reuses the same instance to prevent multiple connections.
 * 
 * REQUIRED: Make sure your .env.local file contains:
 * DATABASE_URL="file:./dev.db"
 * 
 * The database file will be created in the project root as dev.db
 */

import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get DATABASE_URL from environment, default to dev.db in project root
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db"

// Create adapter for Prisma Client (Prisma 7+ requires adapter for SQLite)
// Pass the database URL config directly to PrismaLibSql
const adapter = new PrismaLibSql({
  url: databaseUrl,
})

// Create or reuse Prisma Client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

// In development, store the instance globally to reuse it
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

