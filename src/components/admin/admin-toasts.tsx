'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, X, XCircle } from 'lucide-react';

export function AdminToasts() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const text = error || message;
  const kind = error ? 'error' : 'success';
  const toastKey = text ? `${kind}:${text}` : null;

  if (!text || toastKey === dismissedKey) return null;

  return (
    <div className="fixed right-4 top-4 z-[80] w-[min(360px,calc(100vw-2rem))] animate-fade-in">
      <div className={`flex items-start gap-3 rounded-[8px] border bg-white p-3 shadow-dropdown ${kind === 'error' ? 'border-danger/25' : 'border-success/25'}`}>
        <div className={`mt-0.5 ${kind === 'error' ? 'text-danger' : 'text-success'}`}>
          {kind === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">{kind === 'error' ? 'Action failed' : 'Action complete'}</p>
          <p className="mt-0.5 text-sm text-text-secondary">{text}</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setDismissedKey(toastKey)}
          className="rounded-[8px] p-1 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
