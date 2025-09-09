
# **Feature: Database Candidates View**

- **Date:** 2025-09-09
- **Commit:** (will be added after commit)

## Problem

The project blueprint specified a `candidates` table in the database schema, but the implementation used `profiles` and `resumes` tables. This created a naming inconsistency and deviated from the documented architecture.

## Root Cause

The initial database schema design separated user profile information from resume data, which is a valid approach, but it did not align with the simplified `candidates` table concept in the project plan.

## Solution

To address the inconsistency without a disruptive data migration, a **database view** named `public.candidates` was created.

- This view joins the `auth.users`, `public.profiles`, and `public.resumes` tables.
- It provides a unified, read-only representation of candidate data, aligning with the blueprint's expectations.
- This avoids changing the underlying table structure while still offering a convenient, unified interface for querying candidate data.

### Code Snippet (SQL Migration)

```sql
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
```
