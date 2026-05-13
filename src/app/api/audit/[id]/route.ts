// ============================================================
// GET /api/audit/[id] — Fetch audit by ID from Supabase
// ============================================================

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length < 5) {
      return NextResponse.json({ error: 'Invalid audit ID' }, { status: 400 });
    }

    const supabase = getServerSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields and return clean response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any;
    return NextResponse.json({
      id: row.id,
      createdAt: row.created_at,
      teamSize: row.team_size,
      useCase: row.use_case,
      tools: typeof row.tools_json === 'string' ? JSON.parse(row.tools_json) : row.tools_json,
      recommendations: typeof row.recommendations_json === 'string' ? JSON.parse(row.recommendations_json) : row.recommendations_json,
      totalSpend: row.total_spend,
      totalSavings: row.total_savings,
      aiSummary: row.ai_summary,
    });
  } catch (error) {
    console.error('[API /audit/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
