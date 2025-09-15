#!/bin/bash

echo "🚀 Applying database migration via Supabase REST API..."

# Load environment variables from .env file
source .env

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase environment variables"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env"
    exit 1
fi

echo "🔗 Connecting to Supabase..."
echo "📍 URL: $NEXT_PUBLIC_SUPABASE_URL"

# Try to execute the migration SQL using Supabase's RPC endpoint
echo "📝 Attempting to apply migration..."

# Create the SQL migration
SQL_MIGRATION="
-- Add analysis columns to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100),
ADD COLUMN IF NOT EXISTS analysis_data JSONB,
ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMPTZ;

-- Add index for faster sorting by score
CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);

-- Add comments for clarity
COMMENT ON COLUMN public.candidates.analysis_score IS 'Overall candidate analysis score (0-100)';
COMMENT ON COLUMN public.candidates.analysis_data IS 'Detailed analysis results including strengths, weaknesses, and recommendations';
COMMENT ON COLUMN public.candidates.last_analyzed IS 'Timestamp of last analysis performed';
"

# Try to execute via RPC call
RESPONSE=$(curl -s -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$SQL_MIGRATION\"}")

echo "📋 Response: $RESPONSE"

if [[ $RESPONSE == *"error"* ]]; then
    echo "⚠️  Direct SQL execution via API is not available."
    echo ""
    echo "📋 Please apply the migration manually via Supabase Dashboard:"
    echo ""
    echo "1. Go to: https://supabase.com/dashboard/project/sswrwfkrdauseeahfjsg"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy and paste the following SQL:"
    echo ""
    echo "$SQL_MIGRATION"
    echo ""
    echo "4. Click 'Run' to execute the migration"
    echo "5. Then run 'npm run build' to test the application"
    echo ""
else
    echo "✅ Migration applied successfully!"
    echo "🎉 You can now run 'npm run build' to test the updated application!"
fi
