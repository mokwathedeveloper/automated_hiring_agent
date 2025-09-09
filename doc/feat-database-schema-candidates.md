### Problem

The initial database schema did not include a dedicated table for storing parsed candidate information, such as name, email, phone, work experience, skills, and education. This data was previously extracted and stored within the `resumes` table's `analysis` JSONB field, which is not ideal for structured querying, filtering, and direct management of candidate profiles.

### Root Cause

The original database design focused primarily on resume analysis results rather than a distinct entity for candidates. This oversight led to the absence of a `candidates` table, making it challenging to implement a dedicated candidate dashboard with robust search and filtering capabilities.

### Solution Implemented

A new `candidates` table has been created in the Supabase database to store structured candidate data. A migration script (`migrations/supabase/20250909135157_create_candidates_table.up.sql`) was generated and applied to introduce this table with the following schema:

- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `work_experience` (jsonb)
- `skills` (text[])
- `education` (jsonb)
- `created_at` (timestamp with timezone, default now())

Row-level security (RLS) policies were also defined for the `candidates` table to ensure that only authenticated users can view, insert, update, and delete candidate records.

### Commit Reference

[Commit Hash will be added here after commit]