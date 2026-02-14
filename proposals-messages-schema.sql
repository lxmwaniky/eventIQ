-- Proposals and Messages Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROPOSALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT NOT NULL,
    proposed_rate DECIMAL(10,2),
    delivery_time TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS proposals_job_id_idx ON public.proposals(job_id);
CREATE INDEX IF NOT EXISTS proposals_vendor_id_idx ON public.proposals(vendor_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON public.proposals(status);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS messages_proposal_id_idx ON public.messages(proposal_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR PROPOSALS
-- ============================================

-- Vendors can view their own proposals
CREATE POLICY "Vendors can view own proposals"
    ON public.proposals
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vendors
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE vendors.id = proposals.vendor_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Organizers can view proposals for their jobs
CREATE POLICY "Organizers can view proposals for their jobs"
    ON public.proposals
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE jobs.id = proposals.job_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Vendors can create proposals
CREATE POLICY "Vendors can create proposals"
    ON public.proposals
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vendors
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE vendors.id = proposals.vendor_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Vendors can update their own proposals
CREATE POLICY "Vendors can update own proposals"
    ON public.proposals
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.vendors
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE vendors.id = proposals.vendor_id
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vendors
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE vendors.id = proposals.vendor_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Organizers can update proposal status
CREATE POLICY "Organizers can update proposal status"
    ON public.proposals
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE jobs.id = proposals.job_id
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.jobs
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE jobs.id = proposals.job_id
            AND profiles.user_id = auth.uid()
        )
    );

-- ============================================
-- RLS POLICIES FOR MESSAGES
-- ============================================

-- Users can view messages in proposals they're part of
CREATE POLICY "Users can view messages in their proposals"
    ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            -- Vendor can see messages
            SELECT 1 FROM public.proposals
            INNER JOIN public.vendors ON proposals.vendor_id = vendors.id
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.user_id = auth.uid()
        )
        OR
        EXISTS (
            -- Organizer can see messages
            SELECT 1 FROM public.proposals
            INNER JOIN public.jobs ON proposals.job_id = jobs.id
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Users can send messages in proposals they're part of
CREATE POLICY "Users can send messages in their proposals"
    ON public.messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            -- Sender must be part of the proposal
            SELECT 1 FROM public.proposals
            INNER JOIN public.vendors ON proposals.vendor_id = vendors.id
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.id = messages.sender_id
            AND profiles.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.proposals
            INNER JOIN public.jobs ON proposals.job_id = jobs.id
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.id = messages.sender_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Users can update message read status
CREATE POLICY "Users can update message read status"
    ON public.messages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.proposals
            INNER JOIN public.vendors ON proposals.vendor_id = vendors.id
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.proposals
            INNER JOIN public.jobs ON proposals.job_id = jobs.id
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.proposals
            INNER JOIN public.vendors ON proposals.vendor_id = vendors.id
            INNER JOIN public.profiles ON vendors.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.proposals
            INNER JOIN public.jobs ON proposals.job_id = jobs.id
            INNER JOIN public.organizers ON jobs.organizer_id = organizers.id
            INNER JOIN public.profiles ON organizers.profile_id = profiles.id
            WHERE proposals.id = messages.proposal_id
            AND profiles.user_id = auth.uid()
        )
    );

-- ============================================
-- FUNCTION TO UPDATE PROPOSAL COUNT ON JOBS
-- ============================================
CREATE OR REPLACE FUNCTION update_job_proposals_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE jobs 
        SET proposals_count = proposals_count + 1 
        WHERE id = NEW.job_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE jobs 
        SET proposals_count = proposals_count - 1 
        WHERE id = OLD.job_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_proposals_count ON proposals;
CREATE TRIGGER trigger_update_proposals_count
AFTER INSERT OR DELETE ON proposals
FOR EACH ROW
EXECUTE FUNCTION update_job_proposals_count();
