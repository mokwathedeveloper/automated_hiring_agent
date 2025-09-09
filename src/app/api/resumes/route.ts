
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, createSuccessResponse, withCORS } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return withCORS(createErrorResponse('Unauthorized', 401), request);
    }

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resumes:', error);
      throw new Error(error.message);
    }

    return withCORS(createSuccessResponse(resumes), request);
  } catch (error: any) {
    console.error('Error in /api/resumes:', error);
    return withCORS(createErrorResponse(error.message || 'Internal Server Error', 500), request);
  }
}
