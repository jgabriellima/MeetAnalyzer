-- RLS Policies for meetings table

-- Enable Row Level Security on meetings table
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own meetings
CREATE POLICY "Users can view their own meetings" 
ON public.meetings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy to allow users to insert their own meetings
CREATE POLICY "Users can insert their own meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own meetings
CREATE POLICY "Users can update their own meetings" 
ON public.meetings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy to allow users to delete their own meetings
CREATE POLICY "Users can delete their own meetings" 
ON public.meetings 
FOR DELETE 
USING (auth.uid() = user_id); 