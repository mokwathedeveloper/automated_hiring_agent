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

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates are viewable by authenticated users." ON public.candidates
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert candidates." ON public.candidates
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update candidates." ON public.candidates
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete candidates." ON public.candidates
    FOR DELETE TO authenticated USING (true);

-- Optional: Add an index for faster lookups on email or name if frequently queried
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON public.candidates(name);