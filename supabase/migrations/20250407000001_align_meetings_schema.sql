-- Modify existing columns to match types
ALTER TABLE public.meetings
    ALTER COLUMN title DROP NOT NULL,
    ALTER COLUMN recording_url DROP NOT NULL;

-- Add missing columns
ALTER TABLE public.meetings
    ADD COLUMN IF NOT EXISTS duration INTEGER,
    ADD COLUMN IF NOT EXISTS participants_count INTEGER,
    ADD COLUMN IF NOT EXISTS account_id UUID,
    ADD COLUMN IF NOT EXISTS opportunity_id UUID;

-- Update types definition
COMMENT ON TABLE public.meetings IS 'Stores meeting information including recordings and transcription status';
COMMENT ON COLUMN public.meetings.duration IS 'Duration of the meeting in seconds';
COMMENT ON COLUMN public.meetings.participants_count IS 'Number of participants in the meeting';
COMMENT ON COLUMN public.meetings.account_id IS 'Reference to the account associated with this meeting';
COMMENT ON COLUMN public.meetings.opportunity_id IS 'Reference to the opportunity associated with this meeting'; 