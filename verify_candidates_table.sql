-- Verify Candidates Table Structure

-- Check that it's a table (not a view)
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'candidates' 
AND table_schema = 'public';

-- Check all columns and their types
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'candidates' 
AND schemaname = 'public';

-- List all policies on the table
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'candidates' 
AND schemaname = 'public';
