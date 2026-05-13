// ============================================================
// Social proof — trust indicators and stats
// ============================================================

import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Saved us $340/month just by switching our ChatGPT plan. Took 2 minutes.',
    author: 'Sarah K.',
    role: 'CTO, Series A Startup',
  },
  {
    quote:
      "Didn't realize we were paying for 3 overlapping coding assistants. This audit paid for itself instantly.",
    author: 'Marcus R.',
    role: 'Engineering Lead',
  },
  {
    quote:
      'Shared the report with my CEO and got budget approval for the tools we actually need.',
    author: 'Priya M.',
    role: 'Developer, 12-person team',
  },
];

export function SocialProof() {
  return (
    <section className="py-24 border-y border-zinc-800/50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by engineering teams
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div>
                <div className="text-sm font-semibold text-white">
                  {t.author}
                </div>
                <div className="text-xs text-zinc-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos / trust bar */}
        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-600 uppercase tracking-wider mb-6">
            Works with all major AI tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500">
            {[
              'ChatGPT',
              'Claude',
              'Cursor',
              'GitHub Copilot',
              'Gemini',
              'OpenAI API',
              'Windsurf',
            ].map((tool) => (
              <span
                key={tool}
                className="text-sm font-medium transition-colors hover:text-zinc-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
