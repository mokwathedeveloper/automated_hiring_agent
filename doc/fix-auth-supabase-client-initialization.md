# Supabase Client Initialization Refactor

## Problem Description

The original Supabase client initialization in `src/lib/supabase.ts` used `console.warn` to indicate missing environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`). This approach is not robust, as it allows the application to start and run even with a misconfigured Supabase client, leading to runtime errors that are hard to debug.

## Root Cause

The initialization logic was too permissive and did not enforce the presence of critical environment variables, which are essential for the application's functionality.

## Solution

I refactored the Supabase client initialization to be more strict and provide clearer feedback on configuration issues:

1.  **Fail-Fast Initialization**: Replaced `console.warn` with `throw new Error` for missing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This ensures that the application will not start without the necessary configuration, making it easier to identify and fix setup problems.

2.  **Conditional Admin Client**: Added an explicit check for the `SUPABASE_SERVICE_ROLE_KEY`. The admin client is now only initialized if the service key is present. Otherwise, a warning is logged to the console, and admin-level operations are disabled.

### Code Snippet

```typescript
// src/lib/supabase.ts

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// ...

let supabaseAdmin: ReturnType<typeof createClient> | null = null;
if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will be disabled.');
}
```

## Commit Reference

-   **Hash**: add7b2db
-   **Message**: refactor(supabase): improve client initialization
