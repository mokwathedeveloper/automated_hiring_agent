#!/bin/bash

# Supabase Migration Runner
# Run this script to apply the candidates table migration

echo "🚀 Running Supabase Migration: Create Candidates Table"
echo "=================================================="

# Check if migration file exists
if [ ! -f "migrations/supabase/20250909135157_create_candidates_table.up.sql" ]; then
    echo "❌ Migration file not found!"
    exit 1
fi

echo "📋 Migration file found. Contents:"
echo "----------------------------------"
cat migrations/supabase/20250909135157_create_candidates_table.up.sql
echo "----------------------------------"

echo ""
echo "🔧 To run this migration, you have two options:"
echo ""
echo "Option 1 - Supabase Dashboard (Recommended):"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Navigate to SQL Editor"
echo "4. Copy and paste the SQL above"
echo "5. Click 'Run'"
echo ""
echo "Option 2 - Command Line (if you have psql):"
echo "Replace the connection string with your actual Supabase details:"
echo "psql 'postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres' -f migrations/supabase/20250909135157_create_candidates_table.up.sql"
echo ""
echo "✅ After running the migration, your candidates table will have:"
echo "   - id (UUID, Primary Key)"
echo "   - name (TEXT)"
echo "   - email (TEXT)"
echo "   - phone (TEXT)"
echo "   - work_experience (JSONB)"
echo "   - skills (TEXT[])"
echo "   - education (JSONB) ← This fixes your error!"
echo "   - created_at (TIMESTAMPTZ)"
echo ""
echo "🔒 Row Level Security policies will also be applied."
