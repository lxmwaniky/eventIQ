-- ============================================
-- FIX RLS POLICIES - Update Script
-- ============================================
-- Run this in Supabase SQL Editor if you're experiencing
-- permission errors when updating vendor/organizer data
-- ============================================

-- Drop existing UPDATE policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Vendors can update own data" ON public.vendors;
DROP POLICY IF EXISTS "Organizers can update own data" ON public.organizers;

-- Recreate UPDATE policies with WITH CHECK clause
-- This ensures both USING (read permission) and WITH CHECK (write permission) are set

-- Profiles UPDATE policy
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Vendors UPDATE policy
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

-- Organizers UPDATE policy
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

-- ============================================
-- POLICIES UPDATED!
-- ============================================
-- Your vendor KYC form should now work properly
-- ============================================
