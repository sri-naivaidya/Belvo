'use client';

import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

type FormSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string;
};

export function FormSubmitButton({
  children,
  pendingLabel = 'Processing...',
  className = '',
  onClick,
  disabled,
  type = 'submit',
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  const [clicked, setClicked] = useState(false);
  const busy = pending && clicked;

  return (
    <button
      {...props}
      type={type}
      aria-busy={busy}
      disabled={disabled || pending}
      onClick={(event) => {
        setClicked(true);
        onClick?.(event);
      }}
      className={className}
    >
      {busy && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/25 border-t-current" />}
      {busy ? pendingLabel : children}
    </button>
  );
}
