// ============================================================
// SavingsHero — big savings numbers at top of results
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { TrendingDown } from 'lucide-react';

interface SavingsHeroProps {
  monthlySavings: number;
  annualSavings: number;
  currentSpend: number;
}

function AnimatedCounter({ target, prefix = '$' }: { target: number; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }

    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(target, Math.round(increment * step));
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
    </span>
  );
}

export function SavingsHero({
  monthlySavings,
  annualSavings,
  currentSpend,
}: SavingsHeroProps) {
  const savingsPercent =
    currentSpend > 0 ? Math.round((monthlySavings / currentSpend) * 100) : 0;

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-8 sm:p-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-emerald-500/20 p-2.5">
          <TrendingDown className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Potential Savings Identified
          </h2>
          <p className="text-sm text-zinc-400">
            Based on your current AI tool stack
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Monthly */}
        <div className="text-center sm:text-left">
          <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">
            Monthly Savings
          </div>
          <div className="text-4xl font-extrabold text-white sm:text-5xl">
            <AnimatedCounter target={monthlySavings} />
          </div>
          <div className="mt-1 text-sm text-zinc-500">per month</div>
        </div>

        {/* Annual */}
        <div className="text-center sm:text-left">
          <div className="text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">
            Annual Savings
          </div>
          <div className="text-4xl font-extrabold text-white sm:text-5xl">
            <AnimatedCounter target={annualSavings} />
          </div>
          <div className="mt-1 text-sm text-zinc-500">per year</div>
        </div>

        {/* Percentage */}
        <div className="text-center sm:text-left">
          <div className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-1">
            Cost Reduction
          </div>
          <div className="text-4xl font-extrabold text-white sm:text-5xl">
            <AnimatedCounter target={savingsPercent} prefix="" />%
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            of ${currentSpend}/mo spend
          </div>
        </div>
      </div>
    </div>
  );
}
