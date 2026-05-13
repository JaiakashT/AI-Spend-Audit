// ============================================================
// POST /api/audit — Run audit engine + save to Supabase
// ============================================================

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runAudit } from '@/lib/audit-engine';
import { getServerSupabase } from '@/lib/supabase/server';
import type { AuditInput } from '@/types/audit';

const toolSchema = z.object({
  id: z.string(),
  toolName: z.string().min(1),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0),
  seats: z.number().int().min(1),
});

const auditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(10000),
  useCase: z.enum(['coding', 'writing', 'research', 'data', 'mixed']),
  tools: z.array(toolSchema).min(1).max(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = auditInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input: AuditInput = parsed.data;

    // Run rule-based audit
    const result = runAudit(input);

    // Save to Supabase (if available)
    const supabase = getServerSupabase();
    if (supabase) {
      const { error } = await supabase.from('audits').insert({
        id: result.id,
        team_size: input.teamSize,
        use_case: input.useCase,
        tools_json: JSON.stringify(input.tools),
        recommendations_json: JSON.stringify(result.recommendations),
        total_spend: result.totalCurrentSpend,
        total_savings: result.totalMonthlySavings,
        ai_summary: null,
      });

      if (error) {
        console.error('[Supabase] Insert audit error:', error);
        // Don't fail the request — audit still works without persistence
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API /audit] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
