-- ========================================
-- 🔒 CRITICAL SECURITY FIX: USER DATA ISOLATION
-- ========================================
-- This fixes the security issue where users can see other users' candidates

-- Step 1: Add user_id column to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Drop existing insecure RLS policies
DROP POLICY IF EXISTS "Candidates are viewable by authenticated users." ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can insert candidates." ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can update candidates." ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can delete candidates." ON public.candidates;
DROP POLICY IF EXISTS "Allow authenticated users to read candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow authenticated users to insert candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow authenticated users to update candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow service role full access" ON public.candidates;

-- Step 3: Create secure RLS policies - users can only see their own candidates
CREATE POLICY "Users can view own candidates only" ON public.candidates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own candidates only" ON public.candidates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own candidates only" ON public.candidates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own candidates only" ON public.candidates
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Allow service role to manage all candidates (for admin operations)
CREATE POLICY "Service role can manage all candidates" ON public.candidates
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Step 5: Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);

-- Step 6: Add comment for documentation
COMMENT ON COLUMN public.candidates.user_id IS 'References the user who owns this candidate record - ensures data isolation';

-- ========================================
-- ✅ SECURITY FIX COMPLETE
-- ========================================
-- After running this migration:
-- 1. Each candidate will be owned by a specific user
-- 2. Users can only see their own candidates
-- 3. Existing candidates without user_id will need to be assigned or cleaned up
-- 4. New candidates will automatically be assigned to the creating user
