import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Handle missing environment variables gracefully during build
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time to prevent errors
    console.warn('Supabase environment variables not found, using mock client for build');
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );
}