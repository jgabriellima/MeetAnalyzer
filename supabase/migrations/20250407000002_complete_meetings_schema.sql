-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.meeting_comments CASCADE;
DROP TABLE IF EXISTS public.meeting_participants CASCADE;
DROP TABLE IF EXISTS public.meeting_themes CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;

-- Create meetings table with all columns
CREATE TABLE public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    recording_url TEXT,
    transcript TEXT,
    meeting_date TIMESTAMPTZ,
    duration INTEGER,
    participants_count INTEGER,
    account_id UUID,
    opportunity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meeting_participants table
CREATE TABLE public.meeting_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id),
    name TEXT NOT NULL,
    email TEXT,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meeting_themes table
CREATE TABLE public.meeting_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id),
    name TEXT NOT NULL,
    weight FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meeting_comments table
CREATE TABLE public.meeting_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id),
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    timestamp INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_comments ENABLE ROW LEVEL SECURITY;

-- Policies for meetings table
CREATE POLICY "Users can view their own meetings" 
ON public.meetings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meetings" 
ON public.meetings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings" 
ON public.meetings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings" 
ON public.meetings FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for meeting_participants table
CREATE POLICY "Users can view participants of their meetings" 
ON public.meeting_participants FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_participants.meeting_id 
    AND meetings.user_id = auth.uid()
));

CREATE POLICY "Users can manage participants of their meetings" 
ON public.meeting_participants FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_participants.meeting_id 
    AND meetings.user_id = auth.uid()
));

-- Policies for meeting_themes table
CREATE POLICY "Users can view themes of their meetings" 
ON public.meeting_themes FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_themes.meeting_id 
    AND meetings.user_id = auth.uid()
));

CREATE POLICY "Users can manage themes of their meetings" 
ON public.meeting_themes FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_themes.meeting_id 
    AND meetings.user_id = auth.uid()
));

-- Policies for meeting_comments table
CREATE POLICY "Users can view comments of their meetings" 
ON public.meeting_comments FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_comments.meeting_id 
    AND meetings.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own comments" 
ON public.meeting_comments FOR ALL 
USING (auth.uid() = user_id);

-- Grant privileges
GRANT ALL ON public.meetings TO authenticated;
GRANT ALL ON public.meeting_participants TO authenticated;
GRANT ALL ON public.meeting_themes TO authenticated;
GRANT ALL ON public.meeting_comments TO authenticated; 