'use client';

export function PageLoader({ label = 'Loading page...' }: { label?: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70]">
      <div className="h-1 overflow-hidden bg-primary-50">
        <div className="h-full w-1/3 animate-[page-loader_1.1s_ease-in-out_infinite] rounded-r-full bg-primary" />
      </div>
      <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-sm font-medium text-text-primary shadow-dropdown">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        {label}
      </div>
    </div>
  );
}

export function PageLoadingState({ label = 'Loading page...' }: { label?: string }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-[8px] border border-border bg-white px-4 py-3 text-sm font-medium text-text-primary shadow-card">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        {label}
      </div>
    </div>
  );
}
