// ============================================================
// POST /api/lead — Lead capture + confirmation email
// ============================================================

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendAuditConfirmationEmail } from '@/lib/resend';
import type { AuditResult } from '@/types/audit';

const leadSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().int().min(1).optional(),
  // Honeypot field — should be empty
  website: z.string().max(0).optional(),
  // Audit data for email
  audit: z.any().optional(),
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { auditId, email, companyName, role, teamSize, website, audit } =
      parsed.data;

    // Honeypot check
    if (website && website.length > 0) {
      // Silently accept but don't process
      return NextResponse.json({ success: true });
    }

    // Rate limit check
    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Save to Supabase
    const supabase = getServerSupabase();
    if (supabase) {
      const { error } = await supabase.from('leads').insert({
        audit_id: auditId,
        email,
        company_name: companyName || null,
        role: role || null,
        team_size: teamSize || null,
      });

      if (error) {
        console.error('[Supabase] Insert lead error:', error);
      }
    }

    // Send confirmation email
    if (audit) {
      await sendAuditConfirmationEmail({
        to: email,
        audit: audit as AuditResult,
        companyName,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /lead] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
