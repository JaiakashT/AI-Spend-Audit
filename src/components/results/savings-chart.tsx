// ============================================================
// SavingsChart — visual spend breakdown (pure CSS)
// ============================================================

import type { Recommendation } from '@/types/audit';

interface SavingsChartProps {
  recommendations: Recommendation[];
  totalSavings: number;
}

export function SavingsChart({ recommendations, totalSavings }: SavingsChartProps) {
  if (recommendations.length === 0) return null;

  // Sort by savings descending
  const sorted = [...recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  );
  const maxSavings = sorted[0]?.monthlySavings || 1;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-6 text-base font-semibold text-white">
        Savings Breakdown
      </h3>

      <div className="space-y-4">
        {sorted.map((rec) => {
          const pct = Math.round((rec.monthlySavings / maxSavings) * 100);
          const share = totalSavings > 0
            ? Math.round((rec.monthlySavings / totalSavings) * 100)
            : 0;

          return (
            <div key={`${rec.toolName}-${rec.recommendedAction}`}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-zinc-300 truncate mr-2">
                  {rec.toolName}
                </span>
                <span className="shrink-0 font-semibold text-emerald-400">
                  ${rec.monthlySavings}/mo
                  <span className="ml-1 text-xs font-normal text-zinc-500">
                    ({share}%)
                  </span>
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
