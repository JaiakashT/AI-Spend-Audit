// ============================================================
// ShareButton — copy shareable audit URL to clipboard
// ============================================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  auditId: string;
}

export function ShareButton({ auditId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/results/${auditId}`
      : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Share link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="gap-2 border-zinc-700 hover:border-emerald-500/30 hover:text-emerald-400"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          Share Results
        </>
      )}
    </Button>
  );
}
