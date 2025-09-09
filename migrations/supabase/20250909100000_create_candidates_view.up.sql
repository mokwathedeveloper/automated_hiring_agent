-- Create a unified view for candidates to align with the blueprint
CREATE OR REPLACE VIEW public.candidates AS
SELECT
    u.id as user_id,
    p.full_name,
    u.email,
    p.avatar_url,
    r.id as resume_id,
    r.filename,
    r.status,
    r.score,
    r.analysis,
    r.created_at as resume_submitted_at,
    r.updated_at
FROM
    auth.users u
LEFT JOIN
    public.profiles p ON u.id = p.id
LEFT JOIN
    public.resumes r ON u.id = r.user_id;

-- Set ownership and grant permissions
ALTER VIEW public.candidates OWNER TO postgres;
GRANT ALL ON TABLE public.candidates TO postgres;
GRANT SELECT ON TABLE public.candidates TO authenticated;

-- Add comments for clarity
COMMENT ON VIEW public.candidates IS 'Unified view of candidates joining users, profiles, and their resumes to align with the project blueprint.';
COMMENT ON COLUMN public.candidates.full_name IS 'Candidate''s full name from their profile.';
COMMENT ON COLUMN public.candidates.score IS 'The latest analysis score for the candidate''s resume.';