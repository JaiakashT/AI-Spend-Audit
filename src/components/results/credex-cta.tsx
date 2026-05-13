// ============================================================
// CredexCTA — conditional call-to-action for Credex
// ============================================================

import { Button } from '@/components/ui/button';
import { ExternalLink, PartyPopper } from 'lucide-react';

interface CredexCtaProps {
  monthlySavings: number;
}

export function CredexCta({ monthlySavings }: CredexCtaProps) {
  if (monthlySavings >= 500) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Your savings potential is significant 🚀
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              With ${monthlySavings}/mo in potential savings, a Credex
              consultation could unlock even more through enterprise
              negotiations and bulk API credits.
            </p>
          </div>
          <a
            href="https://credex.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="shrink-0 gap-2 bg-emerald-600 text-white hover:bg-emerald-500">
              Talk to Credex
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (monthlySavings < 100) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center">
        <PartyPopper className="mx-auto mb-3 h-8 w-8 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">
          Your spending is already well-optimized!
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Great job — your AI tool stack is lean. Keep monitoring as your team
          grows, and re-run this audit quarterly to stay ahead.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Want help implementing these changes?
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Credex can handle vendor negotiations and migration for you.
          </p>
        </div>
        <a
          href="https://credex.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="shrink-0 gap-2 border-zinc-700 hover:border-emerald-500/30 hover:text-emerald-400">
            Learn About Credex
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
