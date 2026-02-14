-- Add jobs/gigs table to the schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES public.organizers(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
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
    )) NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    location TEXT NOT NULL,
    country TEXT,
    city TEXT,
    event_date DATE,
    attendees INTEGER,
    duration TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    proposals_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS jobs_organizer_id_idx ON public.jobs(organizer_id);
CREATE INDEX IF NOT EXISTS jobs_category_idx ON public.jobs(category);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs(status);
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON public.jobs(created_at DESC);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs table

-- Allow everyone to view open jobs
CREATE POLICY "Anyone can view open jobs"
    ON public.jobs
    FOR SELECT
    USING (status = 'open');

-- Allow organizers to insert their own jobs
CREATE POLICY "Organizers can create jobs"
    ON public.jobs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organizers
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE organizers.id = jobs.organizer_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow organizers to update their own jobs
CREATE POLICY "Organizers can update own jobs"
    ON public.jobs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.organizers
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE organizers.id = jobs.organizer_id
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organizers
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE organizers.id = jobs.organizer_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow organizers to delete their own jobs
CREATE POLICY "Organizers can delete own jobs"
    ON public.jobs
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.organizers
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE organizers.id = jobs.organizer_id
            AND profiles.user_id = auth.uid()
        )
    );
