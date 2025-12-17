import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "local-users.json")

type LocalUser = {
  id: string
  email: string
  passwordHash: string
  phone?: string | null
  phone_verified?: boolean
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), "utf8")
  }
}

export function readLocalUsers(): LocalUser[] {
  try {
    ensureDataDir()
    const raw = fs.readFileSync(USERS_FILE, "utf8")
    return JSON.parse(raw || "[]")
  } catch (e) {
    return []
  }
}

export function writeLocalUsers(users: LocalUser[]) {
  ensureDataDir()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8")
}

export async function createLocalUser(email: string, password: string, phone?: string | null) {
  const users = readLocalUsers()
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User already exists")
  }
  const id = cryptoRandomUUID()
  const passwordHash = await bcrypt.hash(password, 10)
  const user: LocalUser = { id, email, passwordHash, phone: phone || null, phone_verified: true }
  users.push(user)
  writeLocalUsers(users)
  return { id, email, phone: user.phone }
}

export async function findLocalUserByEmail(email: string) {
  const users = readLocalUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
}

export async function verifyLocalPassword(user: LocalUser, password: string) {
  return await bcrypt.compare(password, user.passwordHash)
}

function cryptoRandomUUID() {
  // Node 14+ has crypto.randomUUID, but use fallback
  try {
    // @ts-ignore
    return require("crypto").randomUUID()
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
  }
}


