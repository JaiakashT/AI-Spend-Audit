import type { Metadata } from 'next';
import Link from 'next/link';
import { AuditForm } from '@/components/audit-form/audit-form';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Spend Audit — Enter Your AI Tools | Credex',
  description:
    'Enter your AI tool subscriptions and get instant recommendations to reduce costs.',
};

export default function AuditPage() {
  return (
    <main className="flex-1 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Audit Your AI Spend
          </h1>
          <p className="mt-3 text-zinc-400">
            Add the AI tools your team uses. We&apos;ll analyze your stack and
            find savings opportunities.
          </p>
        </div>

        {/* Form */}
        <AuditForm />
      </div>
    </main>
  );
}
