// ============================================================
// AiSummary — display AI-generated audit summary
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import type { AuditResult } from '@/types/audit';

interface AiSummaryProps {
  audit: AuditResult;
}

export function AiSummary({ audit }: AiSummaryProps) {
  const [summary, setSummary] = useState<string>(audit.aiSummary || '');
  const [loading, setLoading] = useState(!audit.aiSummary);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (audit.aiSummary) return;

    async function fetchSummary() {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(audit),
        });

        if (!res.ok) throw new Error('Failed to generate summary');

        const data = await res.json();
        setSummary(data.summary);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [audit]);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-zinc-400">
            Generating AI summary...
          </span>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-2" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    );
  }

  if (error || !summary) return null;

  return (
    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-medium text-emerald-400">
          AI-Powered Summary
        </span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-300">{summary}</p>
    </div>
  );
}
