-- Fix Candidates Table RLS Policies
-- This script updates the RLS policies to ensure proper user data isolation

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Candidates are viewable by authenticated users." ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can insert candidates." ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can update candidates." ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can delete candidates." ON public.candidates;

-- Step 2: Create proper user-isolated RLS policies
-- Users can only view their own candidates
CREATE POLICY "Users can view own candidates" ON public.candidates
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert candidates with their own user_id
CREATE POLICY "Users can insert own candidates" ON public.candidates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own candidates
CREATE POLICY "Users can update own candidates" ON public.candidates
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own candidates
CREATE POLICY "Users can delete own candidates" ON public.candidates
    FOR DELETE USING (auth.uid() = user_id);

-- Step 3: Ensure user_id column has proper constraints
-- Add NOT NULL constraint to user_id if it doesn't exist
ALTER TABLE public.candidates 
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint to ensure user_id references auth.users
ALTER TABLE public.candidates 
ADD CONSTRAINT fk_candidates_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Create index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);

-- Step 5: Verify RLS is enabled
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
