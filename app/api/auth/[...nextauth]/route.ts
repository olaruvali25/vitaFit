/**
 * NextAuth API Route Handler
 * 
 * This exports the GET and POST handlers from auth.ts
 * which are used by Auth.js to handle authentication requests.
 */

import { handlers } from "@/auth"

export const { GET, POST } = handlers

// Ensure this is a dynamic route
export const dynamic = "force-dynamic"

// Use Node.js runtime for Auth.js
export const runtime = "nodejs"
