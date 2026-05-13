// ============================================================
// Features section — feature cards with icons
// ============================================================

import { Zap, TrendingDown, Share2, Shield } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    description:
      'Get a complete AI spend breakdown in under 60 seconds. No waiting, no meetings.',
  },
  {
    icon: TrendingDown,
    title: 'Smart Recommendations',
    description:
      'Rule-based engine detects overspending, plan mismatches, and overlap across your AI tools.',
  },
  {
    icon: Share2,
    title: 'Shareable Reports',
    description:
      'Generate beautiful, shareable audit URLs to align your team and justify budget changes.',
  },
  {
    icon: Shield,
    title: 'Privacy-First',
    description:
      'We never see your API keys or data. Just tool names, plans, and spend. That\'s it.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need to cut AI costs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Our audit engine analyzes your AI stack and delivers actionable
            recommendations backed by real pricing data.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900"
            >
              <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
