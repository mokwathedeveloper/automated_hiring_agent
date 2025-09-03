// src/app/api/resumes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase, db } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: resumes, error } = await db.getUserResumes(user.id);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch resumes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Resumes API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}