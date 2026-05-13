// ============================================================
// Hero section — main landing page hero with animated gradient
// ============================================================

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-44">
      {/* Animated gradient background */}
      <div className="hero-gradient" />
      <div className="hero-grid" />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Free AI spend analysis — no signup required</span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block text-white">Find Hidden Waste in</span>
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Your AI Subscriptions
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Startups waste up to 40% on AI tools — overlapping subscriptions,
          overpowered plans, retail API pricing. Get a free audit in 60 seconds.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/audit">
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-full bg-emerald-600 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
            >
              Audit My AI Spend
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-zinc-500">
            Takes 60 seconds · No email required · 100% free
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { value: '$2.4M+', label: 'Savings identified' },
            { value: '1,200+', label: 'Audits completed' },
            { value: '38%', label: 'Avg. cost reduction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-zinc-500 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
