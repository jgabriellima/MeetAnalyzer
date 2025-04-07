-- Create the meetings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    recording_url TEXT NOT NULL,
    transcription_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_updated_at'
    ) THEN
        CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON public.meetings
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- Grant access to authenticated users
GRANT ALL ON public.meetings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS meetings_user_id_idx ON public.meetings(user_id);

-- Add comment to the table
COMMENT ON TABLE public.meetings IS 'Stores meeting information including recordings and transcription status'; 