-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "profilePicture" TEXT;

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tracker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "dailyProgress" JSONB NOT NULL,
    "weeklyOverview" JSONB NOT NULL,
    "caloriesHistory" JSONB NOT NULL DEFAULT [],
    "workoutHistory" JSONB NOT NULL DEFAULT [],
    "hydrationHistory" JSONB NOT NULL DEFAULT [],
    "currentPlan" JSONB NOT NULL,
    "goalWeight" REAL NOT NULL DEFAULT 0,
    "startWeight" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tracker_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "hasUsedFreeTrial" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free_trial',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "hasUsedFreeTrial", "id", "image", "name", "passwordHash", "role", "updatedAt") SELECT "createdAt", "email", "emailVerified", "hasUsedFreeTrial", "id", "image", "name", coalesce("passwordHash", '') AS "passwordHash", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_code_key" ON "PasswordReset"("code");

-- CreateIndex
CREATE INDEX "PasswordReset_userId_idx" ON "PasswordReset"("userId");

-- CreateIndex
CREATE INDEX "PasswordReset_code_idx" ON "PasswordReset"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tracker_profileId_key" ON "Tracker"("profileId");
