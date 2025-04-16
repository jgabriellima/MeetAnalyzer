-- Create accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id text,
    subscription_status text DEFAULT 'inactive',
    subscription_plan text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_accounts_updated_at'
    ) THEN
        CREATE TRIGGER update_accounts_updated_at
            BEFORE UPDATE ON accounts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own account"
ON accounts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own account"
ON accounts FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Service role can manage accounts
CREATE POLICY "Service role can manage accounts"
ON accounts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create usage table for tracking feature usage
CREATE TABLE IF NOT EXISTS usage (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    feature text NOT NULL,
    count integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, feature)
);

-- Add updated_at trigger if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_usage_updated_at'
    ) THEN
        CREATE TRIGGER update_usage_updated_at
            BEFORE UPDATE ON usage
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS on usage table
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Create policies for usage table
CREATE POLICY "Users can view their own usage"
ON usage FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service role can manage usage
CREATE POLICY "Service role can manage usage"
ON usage FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
CREATE INDEX IF NOT EXISTS usage_user_id_feature_idx ON usage(user_id, feature); 