import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

// Helper function to safely get environment variables
function getEnvVar(name: string, fallback: string = ''): string {
  return process.env[name] || fallback;
}

// Check if we're in build mode and environment variables are missing
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');
const googleClientId = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || 'placeholder-client-id',
      clientSecret: googleClientSecret || 'placeholder-client-secret',
    }),
  ],
  // Only use SupabaseAdapter if environment variables are available
  ...(supabaseUrl && supabaseServiceKey ? {
    adapter: SupabaseAdapter({
      url: supabaseUrl,
      secret: supabaseServiceKey,
    }),
  } : {}),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};
