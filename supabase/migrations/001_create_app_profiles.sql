-- Create app_profiles table for user-created profiles
-- This is separate from the 'profiles' table which stores account metadata

CREATE TABLE IF NOT EXISTS app_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  profile_picture TEXT,
  age INTEGER,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  goal TEXT,
  goal_weight NUMERIC,
  activity_level TEXT,
  timeline TEXT,
  dietary_restrictions TEXT,
  workout_days TEXT,
  workout_duration TEXT,
  meal_prep_duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_app_profiles_user_id ON app_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE app_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own profiles
CREATE POLICY "Users can view own profiles" ON app_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own profiles
CREATE POLICY "Users can insert own profiles" ON app_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own profiles
CREATE POLICY "Users can update own profiles" ON app_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own profiles
CREATE POLICY "Users can delete own profiles" ON app_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_app_profiles_updated_at
  BEFORE UPDATE ON app_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

