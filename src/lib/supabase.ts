// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables for client-side
if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Client-side Supabase client (for authentication and user operations)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for admin operations)
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;
if (supabaseServiceKey) {
  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will be disabled.');
}

export { supabaseAdmin };

// Database table names
export const TABLES = {
  USERS: 'users',
  RESUMES: 'resumes',
  ANALYSES: 'analyses',
  SUBSCRIPTIONS: 'subscriptions',
} as const;

// Auth helper functions
export const auth = {
  // Sign in with magic link
  signInWithMagicLink: async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },
};

// Database helper functions
export const db = {
  // Insert resume analysis
  insertResume: async (userId: string, resumeData: any) => {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured. Cannot insert resume.');
    }
    
    const { data, error } = await (supabaseAdmin as any)
      .from(TABLES.RESUMES)
      .insert({
        user_id: userId,
        content: resumeData.content,
        analysis: resumeData.analysis,
        created_at: new Date().toISOString(),
        filename: resumeData.filename, // This was missing
      })
      .select()
      .single();
    
    return { data, error };
  },

  // Get user resumes
  getUserResumes: async (userId: string) => {
    const { data, error } = await supabase
      .from(TABLES.RESUMES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Update user profile
  updateUserProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    return { data, error };
  },
};

export default supabase;
