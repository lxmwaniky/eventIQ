-- ============================================
-- eventIQ Supabase Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste this code → Run
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Extends auth.users with public profile information
-- Linked 1:1 with auth.users via user_id

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('vendor', 'organizer', 'both')) NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- ============================================
-- 2. VENDORS TABLE
-- ============================================
-- Stores vendor-specific business information

CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name TEXT,
    category TEXT CHECK (category IN (
        'event_planning',
        'venue_sourcing',
        'catering',
        'audio_visual',
        'decor_styling',
        'entertainment',
        'photography',
        'security',
        'other'
    )),
    description TEXT,
    location TEXT,
    country TEXT,
    city TEXT,
    services_offered TEXT[], -- Array of services
    portfolio_images TEXT[], -- Array of image URLs
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS vendors_profile_id_idx ON public.vendors(profile_id);
CREATE INDEX IF NOT EXISTS vendors_category_idx ON public.vendors(category);
CREATE INDEX IF NOT EXISTS vendors_country_idx ON public.vendors(country);
CREATE INDEX IF NOT EXISTS vendors_city_idx ON public.vendors(city);
CREATE INDEX IF NOT EXISTS vendors_verified_idx ON public.vendors(verified);
CREATE INDEX IF NOT EXISTS vendors_rating_idx ON public.vendors(rating);

-- ============================================
-- 3. ORGANIZERS TABLE
-- ============================================
-- Stores organizer-specific information

CREATE TABLE IF NOT EXISTS public.organizers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    organization_name TEXT,
    organization_type TEXT CHECK (organization_type IN (
        'individual',
        'company',
        'ngo',
        'government',
        'other'
    )) DEFAULT 'individual',
    location TEXT,
    country TEXT,
    city TEXT,
    events_organized INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS organizers_profile_id_idx ON public.organizers(profile_id);
CREATE INDEX IF NOT EXISTS organizers_country_idx ON public.organizers(country);
CREATE INDEX IF NOT EXISTS organizers_verified_idx ON public.organizers(verified);

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================
-- Automatically updates the updated_at timestamp

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles table
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to vendors table
DROP TRIGGER IF EXISTS set_updated_at_vendors ON public.vendors;
CREATE TRIGGER set_updated_at_vendors
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to organizers table
DROP TRIGGER IF EXISTS set_updated_at_organizers ON public.organizers;
CREATE TRIGGER set_updated_at_organizers
    BEFORE UPDATE ON public.organizers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 5. AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
-- Automatically creates a profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, user_type)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'organizer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow public to read basic profile info (for displaying vendor/organizer info)
CREATE POLICY "Public can view basic profiles"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert their profile (handled by trigger)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- VENDORS TABLE POLICIES
-- ============================================

-- Allow vendors to read their own data
CREATE POLICY "Vendors can view own data"
    ON public.vendors
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = vendors.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow vendors to update their own data
CREATE POLICY "Vendors can update own data"
    ON public.vendors
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = vendors.profile_id
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = vendors.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow vendors to insert their own data
CREATE POLICY "Vendors can insert own data"
    ON public.vendors
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = vendors.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow public to view all vendors (for browsing)
CREATE POLICY "Public can view vendors"
    ON public.vendors
    FOR SELECT
    USING (true);

-- ============================================
-- ORGANIZERS TABLE POLICIES
-- ============================================

-- Allow organizers to read their own data
CREATE POLICY "Organizers can view own data"
    ON public.organizers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = organizers.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow organizers to update their own data
CREATE POLICY "Organizers can update own data"
    ON public.organizers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = organizers.profile_id
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = organizers.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow organizers to insert their own data
CREATE POLICY "Organizers can insert own data"
    ON public.organizers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = organizers.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow public to view organizers (optional - remove if you want privacy)
CREATE POLICY "Public can view organizers"
    ON public.organizers
    FOR SELECT
    USING (true);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT user_type
        FROM public.profiles
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is vendor
CREATE OR REPLACE FUNCTION public.is_vendor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT user_type IN ('vendor', 'both')
        FROM public.profiles
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organizer
CREATE OR REPLACE FUNCTION public.is_organizer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT user_type IN ('organizer', 'both')
        FROM public.profiles
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SCHEMA SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Go to Supabase Dashboard → Authentication → Providers
-- 2. Enable Email provider
-- 3. Configure email templates (optional)
-- 4. Test by creating a user via your signup form
-- ============================================
