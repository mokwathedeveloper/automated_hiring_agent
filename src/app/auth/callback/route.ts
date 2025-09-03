// src/app/auth/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/auth?error=callback_error', req.url));
      }

      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } catch (error) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(new URL('/auth?error=callback_error', req.url));
    }
  }

  // No code provided - redirect to auth page
  return NextResponse.redirect(new URL('/auth', req.url));
}