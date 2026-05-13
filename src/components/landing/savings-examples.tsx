// ============================================================
// Savings examples — before/after pricing showcases
// ============================================================

import { ArrowRight } from 'lucide-react';

const examples = [
  {
    company: '5-person startup',
    before: {
      tools: ['ChatGPT Team', 'Cursor Business', 'GitHub Copilot Enterprise'],
      monthly: 595,
    },
    after: {
      tools: ['ChatGPT Plus', 'Cursor Pro', 'GitHub Copilot Business'],
      monthly: 245,
    },
  },
  {
    company: 'Solo developer',
    before: {
      tools: ['Cursor Business', 'ChatGPT Team', 'Claude Team'],
      monthly: 90,
    },
    after: {
      tools: ['Cursor Pro', 'Claude Pro (consolidate chat)'],
      monthly: 40,
    },
  },
  {
    company: '20-person engineering team',
    before: {
      tools: ['OpenAI API (retail)', 'GitHub Copilot Enterprise'],
      monthly: 1280,
    },
    after: {
      tools: ['OpenAI API (Credex credits)', 'GitHub Copilot Business'],
      monthly: 740,
    },
  },
];

export function SavingsExamples() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Real savings, real startups
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            See how teams like yours are cutting AI costs without sacrificing
            productivity.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {examples.map((ex) => {
            const savings = ex.before.monthly - ex.after.monthly;
            const pct = Math.round((savings / ex.before.monthly) * 100);
            return (
              <div
                key={ex.company}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-emerald-500/20"
              >
                <div className="mb-4 text-sm font-medium text-zinc-500 uppercase tracking-wider">
                  {ex.company}
                </div>

                {/* Before */}
                <div className="mb-3 rounded-xl bg-red-500/5 border border-red-500/10 p-4">
                  <div className="text-xs font-medium text-red-400 mb-2">
                    BEFORE
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${ex.before.monthly}
                    <span className="text-sm font-normal text-zinc-500">/mo</span>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    {ex.before.tools.join(' · ')}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center py-1 text-zinc-600">
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </div>

                {/* After */}
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                  <div className="text-xs font-medium text-emerald-400 mb-2">
                    AFTER
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${ex.after.monthly}
                    <span className="text-sm font-normal text-zinc-500">/mo</span>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    {ex.after.tools.join(' · ')}
                  </div>
                </div>

                {/* Savings badge */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                    Save ${savings}/mo ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
