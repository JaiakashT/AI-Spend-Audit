// ============================================================
// AuditForm — main form with dynamic tool entries
// ============================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuditForm, type AuditFormValues } from '@/hooks/use-audit-form';
import { ToolEntry } from './tool-entry';

export function AuditForm() {
  const router = useRouter();
  const { form, fields, addTool, removeTool, resetForm } = useAuditForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCases = [
    { value: 'coding', label: '💻 Coding' },
    { value: 'writing', label: '✍️ Writing' },
    { value: 'research', label: '🔍 Research' },
    { value: 'data', label: '📊 Data' },
    { value: 'mixed', label: '🔄 Mixed' },
  ];

  const onSubmit = async (data: AuditFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to run audit');
      }

      const result = await res.json();

      // Store result for the results page
      sessionStorage.setItem('audit-result', JSON.stringify(result));

      // Navigate to results
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate running total
  const totalSpend = form
    .watch('tools')
    .reduce((sum, t) => sum + (t.monthlySpend || 0), 0);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Global fields */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">
          Team Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Team Size */}
          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">Team Size</Label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 5"
              className={`bg-zinc-900 border-zinc-700 ${
                form.formState.errors.teamSize ? 'border-red-500' : ''
              }`}
              {...form.register('teamSize', { valueAsNumber: true })}
            />
            {form.formState.errors.teamSize && (
              <p className="text-xs text-red-400">
                {form.formState.errors.teamSize.message}
              </p>
            )}
          </div>

          {/* Use Case */}
          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">Primary Use Case</Label>
            <Select
              value={form.watch('useCase')}
              onValueChange={(val) =>
                form.setValue('useCase', val as AuditFormValues['useCase'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`bg-zinc-900 border-zinc-700 ${
                  form.formState.errors.useCase ? 'border-red-500' : ''
                }`}
              >
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {useCases.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tool entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            AI Tool Subscriptions
          </h2>
          {totalSpend > 0 && (
            <div className="text-sm text-zinc-400">
              Total:{' '}
              <span className="font-semibold text-white">
                ${totalSpend.toLocaleString()}/mo
              </span>
            </div>
          )}
        </div>

        {fields.map((field, index) => (
          <ToolEntry
            key={field.id}
            index={index}
            form={form}
            onRemove={() => removeTool(index)}
            canRemove={fields.length > 1}
          />
        ))}

        {/* Add tool button */}
        {fields.length < 10 && (
          <Button
            type="button"
            variant="outline"
            onClick={addTool}
            className="w-full border-dashed border-zinc-700 bg-transparent text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/5"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Tool
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Validation errors summary */}
      {form.formState.errors.tools?.root && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {form.formState.errors.tools.root.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={resetForm}
          className="text-zinc-500 hover:text-zinc-300"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Form
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="group gap-2 rounded-full bg-emerald-600 px-8 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Run Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
