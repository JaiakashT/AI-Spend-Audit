// ============================================================
// LeadCapture — email capture form with honeypot protection
// ============================================================

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import type { AuditResult } from '@/types/audit';

const leadSchema = z.object({
  email: z.string().email('Enter a valid email'),
  companyName: z.string().optional(),
  role: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadCaptureProps {
  audit: AuditResult;
}

export function LeadCapture({ audit }: LeadCaptureProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setSubmitting(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId: audit.id,
          email: data.email,
          companyName: data.companyName,
          role: data.role,
          website: data.website,
          teamSize: audit.input.teamSize,
          audit,
        }),
      });

      setSubmitted(true);
    } catch {
      // Silently handle — don't block UX
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
        <h3 className="text-base font-semibold text-white">
          Check your inbox!
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          We&apos;ve sent your audit summary to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-emerald-400" />
        <h3 className="text-base font-semibold text-white">
          Get your audit results via email
        </h3>
      </div>
      <p className="mb-5 text-sm text-zinc-400">
        Receive a detailed breakdown with actionable recommendations. No spam,
        ever.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">
              Email <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="you@company.com"
              className={`bg-zinc-900 border-zinc-700 ${
                errors.email ? 'border-red-500' : ''
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Company (optional)</Label>
            <Input
              placeholder="Acme Inc."
              className="bg-zinc-900 border-zinc-700"
              {...register('companyName')}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Role (optional)</Label>
            <Input
              placeholder="CTO"
              className="bg-zinc-900 border-zinc-700"
              {...register('role')}
            />
          </div>
        </div>

        {/* Honeypot — hidden from users */}
        <div className="hidden" aria-hidden="true">
          <input type="text" tabIndex={-1} {...register('website')} />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Email My Results
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
