// ============================================================
// Footer — minimal footer with Credex branding
// ============================================================

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="text-lg font-bold text-white">
              AI Spend Audit
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              by{' '}
              <a
                href="https://credex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Credex
              </a>
            </p>
          </div>

          <nav className="flex items-center gap-6 text-sm text-zinc-500">
            <Link
              href="/#features"
              className="transition-colors hover:text-zinc-300"
            >
              Features
            </Link>
            <Link
              href="/#faq"
              className="transition-colors hover:text-zinc-300"
            >
              FAQ
            </Link>
            <Link
              href="/audit"
              className="transition-colors hover:text-emerald-400"
            >
              Start Audit
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-zinc-800/50 pt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Credex. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
