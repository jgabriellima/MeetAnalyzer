-- Create accounts table
CREATE TABLE public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint to meetings table
ALTER TABLE public.meetings
ADD CONSTRAINT fk_account_id
FOREIGN KEY (account_id)
REFERENCES public.accounts(id)
ON DELETE SET NULL; -- Or ON DELETE CASCADE depending on desired behavior

-- Enable RLS on accounts table
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Policies for accounts table (adjust as needed)
CREATE POLICY "Users can view accounts linked to their meetings" 
ON public.accounts FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.account_id = accounts.id
    AND meetings.user_id = auth.uid()
));

-- Allow authenticated users to manage accounts (adjust as needed for your security model)
CREATE POLICY "Authenticated users can manage accounts" 
ON public.accounts FOR ALL 
USING (auth.role() = 'authenticated');

-- Grant privileges
GRANT ALL ON public.accounts TO authenticated; 