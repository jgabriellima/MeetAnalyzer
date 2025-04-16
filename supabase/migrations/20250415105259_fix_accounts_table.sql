-- Fix accounts table by adding user_id and removing name

-- Add user_id column
ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add non-null constraint after populating with data
-- (This approach allows us to safely add the column without breaking existing records)
DO $$
BEGIN
  -- For existing records, we need to set a value for user_id
  -- We can use a default value for existing records
  -- In a real scenario, you might want to populate this from actual user data
  UPDATE accounts
  SET user_id = (SELECT id FROM auth.users LIMIT 1)
  WHERE user_id IS NULL;

  -- Once populated, add the NOT NULL constraint
  ALTER TABLE accounts
  ALTER COLUMN user_id SET NOT NULL;
END
$$;

-- Drop the name column if it exists
ALTER TABLE accounts
DROP COLUMN IF EXISTS name;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);

-- Update RLS policies to use user_id
-- First drop existing policies if they exist
DO $$
BEGIN
  -- Drop the policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'accounts' 
    AND policyname = 'Users can view accounts linked to their meetings'
  ) THEN
    EXECUTE 'DROP POLICY "Users can view accounts linked to their meetings" ON accounts';
  END IF;
  
  -- Check if the policy already exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'accounts' 
    AND policyname = 'Users can view their own account'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view their own account" 
    ON accounts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid())';
  END IF;
  
  -- Check if the policy already exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'accounts' 
    AND policyname = 'Users can update their own account'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own account"
    ON accounts FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid())';
  END IF;
END
$$; 