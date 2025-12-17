// Stub Prisma client for Supabase transition
// This prevents build errors while transitioning from Prisma to Supabase
export const prisma = new Proxy({}, {
  get() {
    throw new Error('Prisma has been replaced with Supabase. Please use Supabase client instead.')
  }
}) as any
