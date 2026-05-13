// ============================================================
// Results page — client-side, reads from sessionStorage
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavingsHero } from '@/components/results/savings-hero';
import { RecommendationCard } from '@/components/results/recommendation-card';
import { SavingsChart } from '@/components/results/savings-chart';
import { CredexCta } from '@/components/results/credex-cta';
import { ShareButton } from '@/components/results/share-button';
import { AiSummary } from '@/components/results/ai-summary';
import { LeadCapture } from '@/components/results/lead-capture';
import type { AuditResult } from '@/types/audit';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('audit-result');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push('/audit');
    }
  }, [router]);

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/audit"
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Edit audit
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Your AI Spend Audit
            </h1>
          </div>
          <div className="flex gap-3">
            <ShareButton auditId={result.id} />
            <Link href="/audit">
              <Button
                variant="outline"
                className="gap-2 border-zinc-700 hover:border-zinc-600"
              >
                <RotateCcw className="h-4 w-4" />
                New Audit
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Savings hero */}
          <SavingsHero
            monthlySavings={result.totalMonthlySavings}
            annualSavings={result.totalAnnualSavings}
            currentSpend={result.totalCurrentSpend}
          />

          {/* AI Summary */}
          <AiSummary audit={result} />

          {/* Credex CTA */}
          <CredexCta monthlySavings={result.totalMonthlySavings} />

          {/* Savings chart */}
          {result.recommendations.length > 0 && (
            <SavingsChart
              recommendations={result.recommendations}
              totalSavings={result.totalMonthlySavings}
            />
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Recommendations ({result.recommendations.length})
              </h2>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <RecommendationCard key={i} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {/* Lead capture */}
          <LeadCapture audit={result} />
        </div>
      </div>
    </main>
  );
}
