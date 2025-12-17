-- =========================================
-- SUPABASE DATABASE SCHEMA SETUP
-- =========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE plan_type AS ENUM ('free trial', 'pro', 'plus', 'family');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due');

-- Create phone validation function
CREATE OR REPLACE FUNCTION validate_phone_format(phone_text TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    country_requirements RECORD;
    country_code TEXT;
    subscriber_digits TEXT;
BEGIN
    -- Must start with + and contain only digits
    IF phone_text !~ '^\+\d+$' THEN
        RETURN FALSE;
    END IF;

    -- Try different country code lengths
    FOR i IN 1..4 LOOP
        IF i < length(phone_text) THEN
            country_code := substring(phone_text, 1, i + 1);
            subscriber_digits := substring(phone_text, i + 2);

            -- Check against known country requirements
            CASE country_code
                WHEN '+1' THEN  -- US/Canada
                    IF length(subscriber_digits) = 10 THEN RETURN TRUE; END IF;
                WHEN '+40' THEN  -- Romania
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+44' THEN  -- UK
                    IF length(subscriber_digits) = 10 THEN RETURN TRUE; END IF;
                WHEN '+33' THEN  -- France
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+49' THEN  -- Germany
                    IF length(subscriber_digits) BETWEEN 10 AND 11 THEN RETURN TRUE; END IF;
                WHEN '+39' THEN  -- Italy
                    IF length(subscriber_digits) BETWEEN 9 AND 10 THEN RETURN TRUE; END IF;
                WHEN '+34' THEN  -- Spain
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+31' THEN  -- Netherlands
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+46' THEN  -- Sweden
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+47' THEN  -- Norway
                    IF length(subscriber_digits) = 8 THEN RETURN TRUE; END IF;
                WHEN '+45' THEN  -- Denmark
                    IF length(subscriber_digits) = 8 THEN RETURN TRUE; END IF;
                WHEN '+7' THEN  -- Russia
                    IF length(subscriber_digits) = 10 THEN RETURN TRUE; END IF;
                WHEN '+81' THEN  -- Japan
                    IF length(subscriber_digits) BETWEEN 10 AND 11 THEN RETURN TRUE; END IF;
                WHEN '+86' THEN  -- China
                    IF length(subscriber_digits) = 11 THEN RETURN TRUE; END IF;
                WHEN '+91' THEN  -- India
                    IF length(subscriber_digits) = 10 THEN RETURN TRUE; END IF;
                WHEN '+55' THEN  -- Brazil
                    IF length(subscriber_digits) BETWEEN 10 AND 11 THEN RETURN TRUE; END IF;
                WHEN '+52' THEN  -- Mexico
                    IF length(subscriber_digits) = 10 THEN RETURN TRUE; END IF;
                WHEN '+27' THEN  -- South Africa
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+61' THEN  -- Australia
                    IF length(subscriber_digits) = 9 THEN RETURN TRUE; END IF;
                WHEN '+65' THEN  -- Singapore
                    IF length(subscriber_digits) = 8 THEN RETURN TRUE; END IF;
                ELSE
                    -- Continue checking other lengths
                    NULL;
            END CASE;
        END IF;
    END LOOP;

    -- Fallback: Basic E.164 check for unknown countries
    IF phone_text ~ '^\+[1-9]\d{6,14}$' THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =========================================
-- PROFILES TABLE
-- =========================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    plan plan_type DEFAULT 'free trial',
    profiles_limit INTEGER DEFAULT 1 CHECK (profiles_limit >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =========================================
-- SUBSCRIPTIONS TABLE
-- =========================================

CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan plan_type NOT NULL,
    status subscription_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id) -- One subscription per user
);

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- =========================================
-- FUNCTIONS AND TRIGGERS
-- =========================================

-- Function to automatically create profile after user signup and phone verification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_phone TEXT;
BEGIN
  -- Extract phone from user metadata
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');

  -- Only create profile if phone is provided and valid
  IF user_phone != '' AND validate_phone_format(user_phone) THEN
    INSERT INTO public.profiles (id, email, phone, phone_verified, plan, profiles_limit)
    VALUES (
      NEW.id,
      NEW.email,
      user_phone,
      TRUE, -- Phone is verified during signup process
      'free trial',
      1
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

-- =========================================
-- GRANTS
-- =========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.subscriptions TO authenticated;
