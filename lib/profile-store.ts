import { supabaseAdmin } from "./supabase"

export type AppProfile = {
  id: string
  userId: string
  name: string
  profilePicture: string | null
  createdAt: string
  updatedAt: string
  age?: number | null
  gender?: string | null
  heightCm?: number | null
  weightKg?: number | null
  goal?: string | null
  goalWeight?: number | null
  activityLevel?: string | null
  timeline?: string | null
  dietaryRestrictions?: string | null
  workoutDays?: string | null
  workoutDuration?: string | null
  mealPrepDuration?: string | null
}

// Convert database row to AppProfile format
function rowToProfile(row: any): AppProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    profilePicture: row.profile_picture,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    age: row.age,
    gender: row.gender,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    goal: row.goal,
    goalWeight: row.goal_weight,
    activityLevel: row.activity_level,
    timeline: row.timeline,
    dietaryRestrictions: row.dietary_restrictions,
    workoutDays: row.workout_days,
    workoutDuration: row.workout_duration,
    mealPrepDuration: row.meal_prep_duration,
  }
}

export async function listProfilesForUser(userId: string): Promise<AppProfile[]> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not available")
    return []
  }

  const { data, error } = await supabaseAdmin
    .from('app_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error listing profiles:", error)
    return []
  }

  return (data || []).map(rowToProfile)
}

export async function getProfileForUser(userId: string, profileId: string): Promise<AppProfile | null> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not available")
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('app_profiles')
    .select('*')
    .eq('id', profileId)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return rowToProfile(data)
}

export async function createProfileForUser(userId: string, name: string): Promise<AppProfile> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not available")
  }

  const now = new Date().toISOString()
  const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  const { data, error } = await supabaseAdmin
    .from('app_profiles')
    .insert({
      user_id: userId,
      name,
      profile_picture: profilePicture,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating profile:", error)
    throw new Error(error.message || "Failed to create profile")
  }

  return rowToProfile(data)
}

export async function updateProfileForUser(
  userId: string,
  profileId: string,
  patch: Partial<Omit<AppProfile, "id" | "userId" | "createdAt">>
): Promise<AppProfile | null> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not available")
    return null
  }

  // Convert camelCase to snake_case for database
  const dbPatch: any = {
    updated_at: new Date().toISOString(),
  }

  if (patch.name !== undefined) dbPatch.name = patch.name
  if (patch.profilePicture !== undefined) dbPatch.profile_picture = patch.profilePicture
  if (patch.age !== undefined) dbPatch.age = patch.age
  if (patch.gender !== undefined) dbPatch.gender = patch.gender
  if (patch.heightCm !== undefined) dbPatch.height_cm = patch.heightCm
  if (patch.weightKg !== undefined) dbPatch.weight_kg = patch.weightKg
  if (patch.goal !== undefined) dbPatch.goal = patch.goal
  if (patch.goalWeight !== undefined) dbPatch.goal_weight = patch.goalWeight
  if (patch.activityLevel !== undefined) dbPatch.activity_level = patch.activityLevel
  if (patch.timeline !== undefined) dbPatch.timeline = patch.timeline
  if (patch.dietaryRestrictions !== undefined) dbPatch.dietary_restrictions = patch.dietaryRestrictions
  if (patch.workoutDays !== undefined) dbPatch.workout_days = patch.workoutDays
  if (patch.workoutDuration !== undefined) dbPatch.workout_duration = patch.workoutDuration
  if (patch.mealPrepDuration !== undefined) dbPatch.meal_prep_duration = patch.mealPrepDuration

  const { data, error } = await supabaseAdmin
    .from('app_profiles')
    .update(dbPatch)
    .eq('id', profileId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error || !data) {
    console.error("Error updating profile:", error)
    return null
  }

  return rowToProfile(data)
}

export async function deleteProfileForUser(userId: string, profileId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not available")
    return false
  }

  const { error } = await supabaseAdmin
    .from('app_profiles')
    .delete()
    .eq('id', profileId)
    .eq('user_id', userId)

  if (error) {
    console.error("Error deleting profile:", error)
    return false
  }

  return true
}

export async function countProfilesForUser(userId: string): Promise<number> {
  if (!supabaseAdmin) {
    return 0
  }

  const { count, error } = await supabaseAdmin
    .from('app_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error("Error counting profiles:", error)
    return 0
  }

  return count || 0
}
