-- Fix Candidates Table Migration
-- This script drops the candidates view and creates the proper table

-- Step 1: Drop the candidates view (if it exists)
DROP VIEW IF EXISTS public.candidates;

-- Step 2: Create the actual candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    work_experience JSONB,
    skills TEXT[],
    education JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable Row Level Security (works on tables, not views)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
CREATE POLICY "Candidates are viewable by authenticated users." ON public.candidates
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert candidates." ON public.candidates
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update candidates." ON public.candidates
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete candidates." ON public.candidates
    FOR DELETE TO authenticated USING (true);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON public.candidates(name);

-- Step 6: Verify the table was created correctly
SELECT 'Table created successfully!' as status;
