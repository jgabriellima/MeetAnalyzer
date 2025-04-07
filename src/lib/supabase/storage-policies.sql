-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert objects into the storage
CREATE POLICY "Allow authenticated uploads to files bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy to allow users to update their own objects
CREATE POLICY "Allow users to update their own objects in files bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy to allow users to select their own objects
CREATE POLICY "Allow users to select their own objects in files bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy to allow users to delete their own objects
CREATE POLICY "Allow users to delete their own objects in files bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'files' AND
    (auth.uid())::text = (storage.foldername(name))[1]
);

-- Grant usage on storage schema
GRANT usage ON schema storage TO anon, authenticated;

-- Grant all on storage.objects to authenticated users
GRANT ALL ON storage.objects TO authenticated;

-- Grant select on storage.buckets to authenticated users
GRANT SELECT ON storage.buckets TO authenticated; 