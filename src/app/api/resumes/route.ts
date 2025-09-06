import { createClient } from '@/lib/supabase/server';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: resumes, error }  = await supabase.from("resumes")
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
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