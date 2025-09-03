# Database Schema

This directory contains the database schema and setup files for the Automated Hiring Agent.

## Files

- `schema.sql` - Main database schema with tables, indexes, and RLS policies
- `seed.sql` - Sample data and reference structures
- `README.md` - This documentation file

## Setup Instructions

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the schema** in your Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of schema.sql
   ```

3. **Configure environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Enable Authentication** in Supabase Dashboard:
   - Go to Authentication > Settings
   - Enable "Enable email confirmations" 
   - Set Site URL to your domain (e.g., `http://localhost:3000`)
   - Add redirect URLs: `http://localhost:3000/auth/callback`

## Tables Overview

### `users`
- Extends Supabase auth.users
- Stores subscription info and usage limits
- Tracks resume analysis usage

### `resumes` 
- Stores uploaded resume files and content
- Contains AI analysis results in JSONB format
- Tracks processing status

### `analyses`
- Detailed analysis breakdowns by type
- Stores recommendations and insights
- Links to parent resume

### `subscriptions`
- Paystack payment tracking
- Subscription status and billing
- Plan limits and features

### `whatsapp_sessions`
- WhatsApp bot conversation state
- Session data and preferences
- Activity tracking

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Service role key required for admin operations

## Indexes

Optimized indexes for:
- User-specific queries
- Time-based sorting
- Resume analysis lookups
- Payment tracking