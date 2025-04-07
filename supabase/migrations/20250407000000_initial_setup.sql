-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Grant initial privileges
GRANT ALL ON SCHEMA storage TO postgres, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO postgres, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA storage TO postgres, authenticated, service_role;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can insert their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can update their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can delete their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Allow authenticated uploads to files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own objects in files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to select their own objects in files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own objects in files bucket" ON storage.objects;

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

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'files') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('files', 'files', false);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Meetings table policies
CREATE POLICY "Users can view their own meetings" 
ON public.meetings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings" 
ON public.meetings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings" 
ON public.meetings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Allow authenticated uploads to files bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to update their own objects in files bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to select their own objects in files bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own objects in files bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

-- Additional grants
GRANT usage ON schema storage TO anon, authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.buckets TO authenticated;
GRANT ALL ON public.meetings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 