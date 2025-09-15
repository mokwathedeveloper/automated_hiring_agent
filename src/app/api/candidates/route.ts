import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Create authenticated client that respects RLS
    const supabase = await createClient();

    // Get the current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';

    // Query candidates with analysis columns - RLS will automatically filter by user_id
    let query = supabase
      .from('candidates')
      .select('id, name, email, phone, work_experience, skills, education, created_at, analysis_score, analysis_data, last_analyzed')
      .eq('user_id', user.id); // Explicitly filter by user_id for extra security

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query.order('analysis_score', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching candidates:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/candidates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
