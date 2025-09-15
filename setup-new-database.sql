-- ========================================
-- 🗄️ COMPLETE DATABASE SETUP FOR NEW SUPABASE PROJECT
-- ========================================
-- Run this in your new Supabase project's SQL Editor

-- ========================================
-- 1. CREATE CANDIDATES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    work_experience JSONB,
    skills TEXT[],
    education JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Analysis columns (new)
    analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100),
    analysis_data JSONB,
    last_analyzed TIMESTAMPTZ
);

-- ========================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON public.candidates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);

-- ========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CREATE RLS POLICIES
-- ========================================
-- Allow authenticated users to read all candidates
CREATE POLICY "Allow authenticated users to read candidates" ON public.candidates
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert candidates
CREATE POLICY "Allow authenticated users to insert candidates" ON public.candidates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update candidates
CREATE POLICY "Allow authenticated users to update candidates" ON public.candidates
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow service role to do everything (for API operations)
CREATE POLICY "Allow service role full access" ON public.candidates
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ========================================
-- 5. CREATE UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_candidates_updated_at
    BEFORE UPDATE ON public.candidates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- 6. ADD COMMENTS FOR DOCUMENTATION
-- ========================================
COMMENT ON TABLE public.candidates IS 'Stores candidate information and analysis results';
COMMENT ON COLUMN public.candidates.id IS 'Unique identifier for each candidate';
COMMENT ON COLUMN public.candidates.name IS 'Full name of the candidate';
COMMENT ON COLUMN public.candidates.email IS 'Email address (unique)';
COMMENT ON COLUMN public.candidates.phone IS 'Phone number';
COMMENT ON COLUMN public.candidates.work_experience IS 'JSON object containing work experience details';
COMMENT ON COLUMN public.candidates.skills IS 'Array of skills';
COMMENT ON COLUMN public.candidates.education IS 'JSON object containing education details';
COMMENT ON COLUMN public.candidates.analysis_score IS 'Overall candidate analysis score (0-100)';
COMMENT ON COLUMN public.candidates.analysis_data IS 'Detailed analysis results including strengths, weaknesses, and recommendations';
COMMENT ON COLUMN public.candidates.last_analyzed IS 'Timestamp of last analysis performed';

-- ========================================
-- 7. GRANT PERMISSIONS
-- ========================================
GRANT ALL ON public.candidates TO authenticated;
GRANT ALL ON public.candidates TO service_role;

-- ========================================
-- ✅ SETUP COMPLETE
-- ========================================
-- Your database is now ready for the AI-Driven Applicant Selection Tool!
