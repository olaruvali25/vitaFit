import { supabase, supabaseAdmin } from './supabase'
import { Database } from '@/types/database'

type User = Database['public']['Tables']['profiles']['Row']


/**
 * Validate phone number format (E.164) with country-specific length validation
 */
export function validatePhoneNumber(phone: string): boolean {
  // Must start with + and contain only digits
  if (!phone.startsWith('+') || !/^\+\d+$/.test(phone)) {
    return false
  }

  // Extract country code (first 1-4 digits after +)
  let countryCode = ''
  let subscriberNumber = ''

  // Try different country code lengths (1-4 digits)
  for (let i = 1; i <= 4 && i < phone.length; i++) {
    const potentialCode = phone.substring(0, i + 1) // + included
    const potentialSubscriber = phone.substring(i + 1)

    if (potentialSubscriber.length >= 6) { // Minimum reasonable subscriber length
      const requirements = getPhoneNumberRequirements(potentialCode)
      if (requirements) {
        if (potentialSubscriber.length >= requirements.min &&
            potentialSubscriber.length <= requirements.max) {
          return true
        }
      }
    }
  }

  // Fallback: Basic E.164 format check (less strict)
  const e164Regex = /^\+[1-9]\d{6,14}$/
  return e164Regex.test(phone)
}

/**
 * Get phone number length requirements by country code
 */
export function getPhoneNumberRequirements(countryCode: string): { min: number, max: number } | null {
  const requirements: Record<string, { min: number, max: number }> = {
    '+1': { min: 10, max: 10 }, // US/Canada
    '+40': { min: 9, max: 9 }, // Romania
    '+44': { min: 10, max: 10 }, // UK
    '+33': { min: 9, max: 9 }, // France
    '+49': { min: 10, max: 11 }, // Germany
    '+39': { min: 9, max: 10 }, // Italy
    '+34': { min: 9, max: 9 }, // Spain
    '+31': { min: 9, max: 9 }, // Netherlands
    '+46': { min: 9, max: 9 }, // Sweden
    '+47': { min: 8, max: 8 }, // Norway
    '+45': { min: 8, max: 8 }, // Denmark
  }

  return requirements[countryCode] || null
}

/**
 * Sign up user with email, password, and phone verification (MANDATORY)
 */
export async function signUpWithPhone(
  email: string,
  password: string,
  phone: string
) {
  // Validate all required inputs - phone is MANDATORY
  if (!email || !password || !phone) {
    throw new Error('Email, password, and phone number are ALL required')
  }

  // Validate phone number format with country-specific requirements
  if (!validatePhoneNumber(phone)) {
    throw new Error('Invalid phone number format. Must include country code and correct number of digits (e.g., +1234567890 for US, +40712345678 for Romania)')
  }

  // Check if Supabase is available
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please configure Supabase environment variables.')
  }

  // Check if phone is already registered (one phone = one account)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .single()

  if (existingProfile) {
    throw new Error('This phone number is already registered. Each phone number can only be used for one account.')
  }

  // Sign up with Supabase Auth - phone is required
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    phone,
    options: {
      data: {
        phone: phone, // Store phone in user metadata for profile creation
        phone_verified: false // Will be set to true after OTP verification
      }
    }
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Verify phone with OTP (required before account activation)
 */
export async function verifyPhoneOTP(phone: string, token: string) {
  // Check if Supabase is available
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please configure Supabase environment variables.')
  }

  // Validate phone format again
  if (!validatePhoneNumber(phone)) {
    throw new Error('Invalid phone number format')
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  })

  if (error) {
    throw error
  }

  // After successful OTP verification, account is now active
  // The profile will be created automatically by the database trigger
  // when the user record is inserted/updated
  if (data.user) {
    // Update phone verification status in profile (if it exists)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ phone_verified: true })
      .eq('id', data.user.id)

    if (updateError) {
      console.error('Failed to update phone verification status:', updateError)
    }
  }

  return data
}

/**
 * Sign in with email and password
 * Note: Phone verification is currently disabled for testing
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please configure Supabase environment variables.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('Authentication failed')
  }

  return data
}

// Note: Profile creation is now handled automatically by database trigger
// This function is kept for reference but not used in the new flow

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }

  return data
}

/**
 * Update user plan (admin/server-side only)
 */
export async function updateUserPlan(userId: string, plan: 'free trial' | 'pro' | 'plus' | 'family') {
  const planLimits = {
    'free trial': 1,
    'pro': 1,
    'plus': 2,
    'family': 4
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      plan,
      profiles_limit: planLimits[plan]
    })
    .eq('id', userId)

  if (error) {
    throw error
  }
}

/**
 * Check if user can create more profiles
 */
export async function canCreateProfile(userId: string): Promise<{
  canCreate: boolean
  currentCount: number
  limit: number
}> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('profiles_limit')
    .eq('id', userId)
    .single()

  if (!profile) {
    return { canCreate: false, currentCount: 0, limit: 0 }
  }

  // Count existing profiles (this would need a profiles table in your schema)
  // For now, assume we track this elsewhere
  const currentCount = 0 // This needs to be implemented based on your profile schema

  return {
    canCreate: currentCount < profile.profiles_limit,
    currentCount,
    limit: profile.profiles_limit
  }
}
