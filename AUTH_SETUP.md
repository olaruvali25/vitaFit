# Auth.js (NextAuth v5) Setup Guide

## ✅ Configuration Complete

The Auth.js setup has been fully configured for NextAuth v5 beta with email/password authentication.

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# REQUIRED: Secret key for signing tokens
# Generate with: openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# REQUIRED: Base URL of your application
# For local development:
AUTH_URL=http://localhost:3000

# REQUIRED: Trust host (set to true for development)
AUTH_TRUST_HOST=true

# Database (already configured)
DATABASE_URL="file:./dev.db"
```

## File Structure

- **`auth.ts`** (root) - Main Auth.js configuration
  - Exports `handlers`, `auth`, `signIn`, `signOut`
  - Uses Credentials provider for email/password
  - Configured with JWT session strategy

- **`app/api/auth/[...nextauth]/route.ts`** - API route handler
  - Exports GET and POST handlers from `auth.ts`
  - Handles all Auth.js API requests

- **`lib/auth-utils.ts`** - Utility functions
  - `getCurrentUser()` - Get current authenticated user
  - `getAuthSession()` - Get full session
  - `requireAuth()` - Require authentication (throws error)
  - `requireAuthPage()` - Require authentication (redirects)

- **`middleware.ts`** - Route protection
  - Uses `auth()` from `auth.ts` to check sessions
  - Protects routes defined in `matcher` config

## Pages

- **`/login`** - Login page with email/password form
- **`/signup`** - Signup page with account creation and auto-login
- **`/forgot-password`** - Password reset request page
- **`/reset-password`** - Password reset confirmation page

## How It Works

1. **Login Flow:**
   - User enters email/password on `/login`
   - `signIn("credentials", ...)` is called
   - Auth.js validates credentials via `authorize()` function
   - Session is created and stored in JWT cookie
   - User is redirected to `/account`

2. **Signup Flow:**
   - User enters details on `/signup`
   - POST to `/api/signup` creates user in database
   - Password is hashed with bcrypt
   - Auto-login attempts with `signIn("credentials", ...)`
   - If successful, redirects to `/account`
   - If auto-login fails, redirects to `/login`

3. **Protected Routes:**
   - Middleware checks for valid session using `auth()`
   - Unauthenticated users are redirected to `/login`
   - API routes return JSON `{ error: "Unauthorized" }` instead of redirecting

## Testing

1. **Create a test user:**
   - Visit `/api/test/create-user` (POST request)
   - Or use the signup page at `/signup`

2. **Login:**
   - Go to `/login`
   - Enter email and password
   - Should redirect to `/account` on success

3. **Signup:**
   - Go to `/signup`
   - Fill in the form
   - Account is created and you're automatically logged in

## Troubleshooting

### Error: "Unexpected token '<', "<!DOCTYPE "… is not valid JSON"

This error occurs when Auth.js API routes return HTML instead of JSON. This has been fixed by:

1. ✅ Correctly exporting `handlers` from `auth.ts`
2. ✅ Using proper NextAuth v5 API route structure
3. ✅ Ensuring middleware doesn't interfere with `/api/auth/*` routes
4. ✅ Using `auth()` function instead of deprecated `getServerSession()`

### Error: "Cannot find module '@/auth'"

Make sure `auth.ts` exists in the project root and TypeScript paths are configured correctly in `tsconfig.json`.

### Session not persisting

- Check that `AUTH_SECRET` is set in `.env.local`
- Verify `AUTH_URL` matches your current URL
- Ensure cookies are enabled in your browser

## Notes

- The old `lib/auth.ts` file is kept for backward compatibility but should not be used
- All new code should import from `@/auth` (which resolves to `auth.ts` at root)
- Session strategy is JWT (no database sessions)
- Password hashing uses bcryptjs with 12 rounds

