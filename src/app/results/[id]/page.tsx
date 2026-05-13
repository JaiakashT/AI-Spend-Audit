// ============================================================
// Public shareable results page — server-side rendered
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavingsHero } from '@/components/results/savings-hero';
import { RecommendationCard } from '@/components/results/recommendation-card';
import { SavingsChart } from '@/components/results/savings-chart';
import { CredexCta } from '@/components/results/credex-cta';
import type { Recommendation } from '@/types/audit';

interface PublicResultsPageProps {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${appUrl}/api/audit/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PublicResultsPageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return { title: 'Audit Not Found' };
  }

  return {
    title: `AI Spend Audit — Save $${audit.totalSavings}/month on AI tools`,
    description:
      audit.aiSummary ||
      `This team found $${audit.totalSavings}/month in potential AI savings across ${audit.tools?.length || 0} tools.`,
    openGraph: {
      title: `AI Spend Audit — Save $${audit.totalSavings}/month`,
      description: `Potential savings of $${audit.totalSavings}/month ($${audit.totalSavings * 12}/year) identified across AI tools.`,
      type: 'article',
      siteName: 'AI Spend Audit by Credex',
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Spend Audit — Save $${audit.totalSavings}/month`,
      description: `Potential savings of $${audit.totalSavings}/month identified.`,
    },
  };
}

export default async function PublicResultsPage({
  params,
}: PublicResultsPageProps) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <h1 className="text-2xl font-bold text-white">Audit Not Found</h1>
        <p className="text-zinc-400">
          This audit may have expired or the URL may be incorrect.
        </p>
        <Link href="/">
          <Button className="mt-4 bg-emerald-600 text-white hover:bg-emerald-500">
            Run Your Own Audit
          </Button>
        </Link>
      </main>
    );
  }

  const recommendations: Recommendation[] = audit.recommendations || [];
  const totalSavings = audit.totalSavings || 0;
  const totalSpend = audit.totalSpend || 0;

  return (
    <main className="flex-1 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Shared Audit Report
          </div>
          <h1 className="text-3xl font-bold text-white">AI Spend Audit</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Generated on{' '}
            {new Date(audit.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="space-y-6">
          {/* Savings hero */}
          <SavingsHero
            monthlySavings={totalSavings}
            annualSavings={totalSavings * 12}
            currentSpend={totalSpend}
          />

          {/* AI Summary */}
          {audit.aiSummary && (
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-6">
              <p className="text-sm leading-relaxed text-zinc-300">
                {audit.aiSummary}
              </p>
            </div>
          )}

          {/* Credex CTA */}
          <CredexCta monthlySavings={totalSavings} />

          {/* Chart */}
          {recommendations.length > 0 && (
            <SavingsChart
              recommendations={recommendations}
              totalSavings={totalSavings}
            />
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Recommendations
              </h2>
              <div className="space-y-3">
                {recommendations.map((rec: Recommendation, i: number) => (
                  <RecommendationCard key={i} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {/* Run your own CTA */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Want to audit your own AI spend?
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              It&apos;s free, takes 60 seconds, and requires no signup.
            </p>
            <Link href="/audit">
              <Button className="mt-4 bg-emerald-600 text-white hover:bg-emerald-500">
                Audit My AI Spend
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
