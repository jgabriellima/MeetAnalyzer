# Supabase Row Level Security (RLS) Setup

This document explains how to set up Row Level Security (RLS) policies for the Meeting Analyzer application.

## Why We Need RLS

Row Level Security allows us to control which users can access which rows in our database tables. This is crucial for:

1. **Security**: Ensuring users can only access their own data
2. **Privacy**: Protecting sensitive meeting information
3. **Data Integrity**: Preventing unauthorized modifications

## The Current Issue

The error message "Error uploading file: new row violates row-level security policy" occurs because:

1. RLS is enabled on the meetings table
2. There are no policies allowing the user to insert new rows

## How to Fix It

### Option 1: Using SQL Editor in Supabase Dashboard

1. Log in to the [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the contents of `src/lib/supabase/rls-policies.sql`
6. Run the query

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Apply the RLS policies
supabase db push --db-url postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## RLS Policies Explained

The RLS policies we're creating are:

1. **Select Policy**: Users can only view their own meetings
   ```sql
   CREATE POLICY "Users can view their own meetings" 
   ON public.meetings 
   FOR SELECT 
   USING (auth.uid() = user_id);
   ```

2. **Insert Policy**: Users can only create meetings where they are the owner
   ```sql
   CREATE POLICY "Users can insert their own meetings" 
   ON public.meetings 
   FOR INSERT 
   WITH CHECK (auth.uid() = user_id);
   ```

3. **Update Policy**: Users can only update their own meetings
   ```sql
   CREATE POLICY "Users can update their own meetings" 
   ON public.meetings 
   FOR UPDATE 
   USING (auth.uid() = user_id);
   ```

4. **Delete Policy**: Users can only delete their own meetings
   ```sql
   CREATE POLICY "Users can delete their own meetings" 
   ON public.meetings 
   FOR DELETE 
   USING (auth.uid() = user_id);
   ```

## Verifying Policies

To verify your policies are working:

1. Go to the Supabase Dashboard
2. Navigate to Database > Policies
3. Find the meetings table
4. Ensure all four policies are listed

## Troubleshooting

If you still encounter RLS errors after applying these policies:

1. Check that the user is properly authenticated
2. Verify that the user_id being inserted matches the authenticated user's ID
3. Check for any typos in the policy definitions
4. Restart your application to ensure it's using the latest policies 