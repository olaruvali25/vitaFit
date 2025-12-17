import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const PROFILES_FILE = path.join(DATA_DIR, "profiles.json")

export type AppProfile = {
  id: string
  userId: string
  name: string
  profilePicture: string | null
  createdAt: string
  updatedAt: string

  // Optional extended fields used across the app
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

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(PROFILES_FILE)) {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify([]), "utf8")
  }
}

function readAllProfiles(): AppProfile[] {
  ensureDataDir()
  const raw = fs.readFileSync(PROFILES_FILE, "utf8")
  return JSON.parse(raw || "[]")
}

function writeAllProfiles(profiles: AppProfile[]) {
  ensureDataDir()
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), "utf8")
}

function cryptoRandomUUID() {
  try {
    // @ts-ignore
    return require("crypto").randomUUID()
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
  }
}

export function listProfilesForUser(userId: string): AppProfile[] {
  const profiles = readAllProfiles()
  return profiles
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getProfileForUser(userId: string, profileId: string): AppProfile | null {
  const profiles = readAllProfiles()
  return profiles.find((p) => p.userId === userId && p.id === profileId) || null
}

export function createProfileForUser(userId: string, name: string): AppProfile {
  const now = new Date().toISOString()
  const profile: AppProfile = {
    id: cryptoRandomUUID(),
    userId,
    name,
    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: now,
    updatedAt: now,
  }

  const profiles = readAllProfiles()
  profiles.push(profile)
  writeAllProfiles(profiles)
  return profile
}

export function updateProfileForUser(
  userId: string,
  profileId: string,
  patch: Partial<Omit<AppProfile, "id" | "userId" | "createdAt">>
): AppProfile | null {
  const profiles = readAllProfiles()
  const idx = profiles.findIndex((p) => p.userId === userId && p.id === profileId)
  if (idx === -1) return null

  const updated: AppProfile = {
    ...profiles[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  profiles[idx] = updated
  writeAllProfiles(profiles)
  return updated
}

export function deleteProfileForUser(userId: string, profileId: string): boolean {
  const profiles = readAllProfiles()
  const before = profiles.length
  const next = profiles.filter((p) => !(p.userId === userId && p.id === profileId))
  if (next.length === before) return false
  writeAllProfiles(next)
  return true
}


