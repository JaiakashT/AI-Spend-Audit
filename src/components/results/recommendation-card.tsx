// ============================================================
// RecommendationCard — per-tool recommendation display
// ============================================================

import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { Recommendation } from '@/types/audit';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const confidenceColors = {
  high: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: tool info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-white truncate">
              {rec.toolName}
            </h3>
            <Badge
              variant="outline"
              className={confidenceColors[rec.confidence]}
            >
              {rec.confidence} confidence
            </Badge>
          </div>

          {/* Current → Recommended */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <span className="text-zinc-500">{rec.currentPlan}</span>
            <span className="text-zinc-500">
              (${rec.currentSpend}/mo)
            </span>
            {rec.recommendedPlan && (
              <>
                <ArrowRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-400 font-medium">
                  {rec.recommendedPlan}
                </span>
              </>
            )}
          </div>

          {/* Action */}
          <p className="text-sm font-medium text-white mb-2">
            {rec.recommendedAction}
          </p>

          {/* Reasoning */}
          <p className="text-sm text-zinc-400 leading-relaxed">
            {rec.reasoning}
          </p>
        </div>

        {/* Right: savings */}
        <div className="shrink-0 text-right sm:ml-6">
          <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Savings
          </div>
          <div className="text-2xl font-bold text-white">
            ${rec.monthlySavings}
            <span className="text-sm font-normal text-zinc-500">/mo</span>
          </div>
          <div className="text-sm text-zinc-500">
            ${rec.annualSavings}/year
          </div>
        </div>
      </div>
    </div>
  );
}
