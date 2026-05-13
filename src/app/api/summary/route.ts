// ============================================================
// POST /api/summary — Generate AI-powered audit summary
// ============================================================

import { NextResponse } from 'next/server';
import { generateAuditSummary } from '@/lib/openai';
import { getServerSupabase } from '@/lib/supabase/server';
import type { AuditResult } from '@/types/audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const audit = body as AuditResult;

    if (!audit || !audit.id || !audit.recommendations) {
      return NextResponse.json(
        { error: 'Invalid audit data' },
        { status: 400 }
      );
    }

    const summary = await generateAuditSummary(audit);

    // Update Supabase with the AI summary
    const supabase = getServerSupabase();
    if (supabase && audit.id) {
      await supabase
        .from('audits')
        .update({ ai_summary: summary })
        .eq('id', audit.id);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('[API /summary] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
