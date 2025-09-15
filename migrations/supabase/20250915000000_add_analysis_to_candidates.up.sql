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
