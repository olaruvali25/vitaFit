# Prisma Setup Guide

## ✅ Configuration Complete

Prisma has been configured for SQLite with Prisma 7+ compatibility.

## Required Environment Variables

Create a `.env.local` file in the project root with:

```env
# REQUIRED: SQLite database URL
# The database file will be created in the project root as dev.db
DATABASE_URL="file:./dev.db"
```

## Database Setup

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push schema to database (creates tables):**
   ```bash
   npx prisma db push
   ```

3. **View database in Prisma Studio (optional):**
   ```bash
   npx prisma studio
   ```

## File Structure

- **`prisma/schema.prisma`** - Database schema definition
  - Contains all models: User, Membership, Profile, Plan, etc.
  - SQLite datasource configured (no `url` field - handled by `prisma.config.ts`)

- **`prisma.config.ts`** - Prisma 7+ configuration
  - Contains `DATABASE_URL` from environment

- **`lib/prisma.ts`** - Shared Prisma Client instance
  - Singleton pattern for development
  - Uses `PrismaLibSql` adapter (required for Prisma 7+ with SQLite)
  - All API routes import from here: `import { prisma } from "@/lib/prisma"`

## Important Notes

- **Prisma 7+ requires an adapter for SQLite** - We use `@prisma/adapter-libsql`
- **Never create multiple PrismaClient instances** - Always import from `lib/prisma.ts`
- **Database file location:** `./dev.db` in project root (created automatically)
- **Schema changes:** Run `npx prisma db push` after modifying `schema.prisma`

## Troubleshooting

### Error: "PrismaClientConstructorValidationError"
- Make sure `DATABASE_URL` is set in `.env.local`
- Run `npx prisma generate` to regenerate the client

### Error: "Cannot find module '@prisma/client'"
- Run `npx prisma generate`
- Make sure `node_modules` exists: `npm install`

### Database not found
- Run `npx prisma db push` to create the database and tables
- Check that `DATABASE_URL` points to a valid location

