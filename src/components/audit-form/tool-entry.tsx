// ============================================================
// ToolEntry — single tool row in the audit form
// ============================================================

'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { getToolNames, getPlansForTool } from '@/lib/audit-rules';
import type { AuditFormValues } from '@/hooks/use-audit-form';

interface ToolEntryProps {
  index: number;
  form: UseFormReturn<AuditFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function ToolEntry({ index, form, onRemove, canRemove }: ToolEntryProps) {
  const toolNames = getToolNames();
  const selectedTool = form.watch(`tools.${index}.toolName`);
  const plans = selectedTool ? getPlansForTool(selectedTool) : [];

  const errors = form.formState.errors.tools?.[index];

  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-all hover:border-zinc-700 sm:p-5">
      {/* Tool number badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          Tool {index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-zinc-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tool Name */}
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Tool</Label>
          <Select
            value={selectedTool || undefined}
            onValueChange={(val) => {
              form.setValue(`tools.${index}.toolName`, val, {
                shouldValidate: true,
              });
              // Reset plan when tool changes
              form.setValue(`tools.${index}.plan`, '');
            }}
          >
            <SelectTrigger
              className={`bg-zinc-900 border-zinc-700 ${
                errors?.toolName ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder="Select tool" />
            </SelectTrigger>
            <SelectContent>
              {toolNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.toolName && (
            <p className="text-xs text-red-400">{errors.toolName.message}</p>
          )}
        </div>

        {/* Plan */}
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Plan</Label>
          <Select
            value={form.watch(`tools.${index}.plan`) || undefined}
            onValueChange={(val) =>
              form.setValue(`tools.${index}.plan`, val, {
                shouldValidate: true,
              })
            }
            disabled={!selectedTool}
          >
            <SelectTrigger
              className={`bg-zinc-900 border-zinc-700 ${
                errors?.plan ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.name} value={plan.name}>
                  {plan.label}
                  {plan.pricePerSeat > 0 && (
                    <span className="text-zinc-500 ml-1">
                      (${plan.pricePerSeat}/seat)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.plan && (
            <p className="text-xs text-red-400">{errors.plan.message}</p>
          )}
        </div>

        {/* Monthly Spend */}
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Monthly Spend ($)</Label>
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="0"
            className={`bg-zinc-900 border-zinc-700 ${
              errors?.monthlySpend ? 'border-red-500' : ''
            }`}
            {...form.register(`tools.${index}.monthlySpend`, {
              valueAsNumber: true,
            })}
          />
          {errors?.monthlySpend && (
            <p className="text-xs text-red-400">
              {errors.monthlySpend.message}
            </p>
          )}
        </div>

        {/* Seats */}
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Seats</Label>
          <Input
            type="number"
            min={1}
            step={1}
            placeholder="1"
            className={`bg-zinc-900 border-zinc-700 ${
              errors?.seats ? 'border-red-500' : ''
            }`}
            {...form.register(`tools.${index}.seats`, {
              valueAsNumber: true,
            })}
          />
          {errors?.seats && (
            <p className="text-xs text-red-400">{errors.seats.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
