// ============================================================
// useAuditForm hook — form state with React Hook Form + Zod
// ============================================================

'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

// ============================================================
// Validation schema
// ============================================================

export const toolEntrySchema = z.object({
  id: z.string(),
  toolName: z.string().min(1, 'Select a tool'),
  plan: z.string().min(1, 'Select a plan'),
  monthlySpend: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .min(0, 'Spend cannot be negative')
    .max(100000, 'Spend seems too high'),
  seats: z
    .number({ invalid_type_error: 'Enter seat count' })
    .int('Must be a whole number')
    .min(1, 'At least 1 seat')
    .max(10000, 'Too many seats'),
});

export const auditFormSchema = z.object({
  teamSize: z
    .number({ invalid_type_error: 'Enter team size' })
    .int('Must be a whole number')
    .min(1, 'At least 1 person')
    .max(10000, 'Team size too large'),
  useCase: z.enum(['coding', 'writing', 'research', 'data', 'mixed'], {
    errorMap: () => ({ message: 'Select a use case' }),
  }),
  tools: z.array(toolEntrySchema).min(1, 'Add at least one tool'),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;

// ============================================================
// Default values
// ============================================================

function createDefaultTool() {
  return {
    id: nanoid(8),
    toolName: '',
    plan: '',
    monthlySpend: 0,
    seats: 1,
  };
}

const defaultValues: AuditFormValues = {
  teamSize: 1,
  useCase: 'coding',
  tools: [createDefaultTool()],
};

// ============================================================
// Hook
// ============================================================

export function useAuditForm() {
  const [savedData, setSavedData, clearSavedData, isHydrated] =
    useLocalStorage<AuditFormValues | null>('ai-spend-audit-form', null);

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tools',
  });

  // Restore from localStorage on hydration
  useEffect(() => {
    if (isHydrated && savedData) {
      form.reset(savedData);
    }
  }, [isHydrated, savedData, form]);

  // Auto-save to localStorage on changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (isHydrated && values) {
        setSavedData(values as AuditFormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isHydrated, setSavedData]);

  const addTool = () => {
    if (fields.length >= 10) return; // max tools
    append(createDefaultTool());
  };

  const removeTool = (index: number) => {
    if (fields.length <= 1) return; // keep at least one
    remove(index);
  };

  const resetForm = () => {
    form.reset(defaultValues);
    clearSavedData();
  };

  return {
    form,
    fields,
    addTool,
    removeTool,
    resetForm,
    isHydrated,
  };
}
