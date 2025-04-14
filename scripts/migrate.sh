#!/bin/bash

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "Supabase CLI is not installed. Please install it first."
    echo "npm install -g supabase"
    exit 1
fi

# Start Supabase if not running
supabase start

# Run migrations
supabase db reset

# Generate types
supabase gen types typescript --local > src/lib/types.ts

echo "Migration completed successfully!" 