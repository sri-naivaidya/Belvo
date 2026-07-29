'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className, ...props }: ButtonProps) {
  const iconOnly = !children;
  const base = 'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:pointer-events-none';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white shadow-sm hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-white text-text-primary border border-border hover:bg-surface-tertiary',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary',
    danger: 'bg-danger text-white hover:bg-red-600',
  };
  const sizes: Record<string, { default: string; iconOnly: string }> = {
    sm: { default: 'h-8 px-3 text-xs rounded-[8px]', iconOnly: 'h-8 w-8 text-xs rounded-[8px]' },
    md: { default: 'h-9 px-3.5 text-sm rounded-[8px]', iconOnly: 'h-9 w-9 text-sm rounded-[8px]' },
    lg: { default: 'h-10 px-4 text-sm rounded-[8px]', iconOnly: 'h-10 w-10 text-sm rounded-[8px]' },
  };
  return (
    <button className={`${base} ${variants[variant]} ${iconOnly ? sizes[size].iconOnly : sizes[size].default} ${loading ? 'opacity-60 cursor-not-allowed' : ''} ${className || ''}`}
      disabled={loading || props.disabled} {...props}>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
}

export function Input({ className, icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">{icon}</div>}
      <input className={`h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary placeholder-text-tertiary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${icon ? 'pl-9' : ''} ${className || ''}`} {...props} />
    </div>
  );
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#7C3AED','#10B981','#F59E0B','#EF4444','#A855F7','#EC4899','#06B6D4','#F97316'];
  const colorIdx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const sz = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };
  return <div className={`rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${sz[size]}`} style={{ backgroundColor: colors[colorIdx] }}>{initials}</div>;
}

export function Badge({ variant = 'gray', children }: { variant?: 'green' | 'orange' | 'red' | 'purple' | 'gray'; children: React.ReactNode }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function StatusDot({ status }: { status: string }) {
  const m: Record<string, string> = { good:'green', warning:'orange', critical:'red', green:'green', orange:'orange', red:'red', purple:'purple' };
  return <span className={`status-dot ${m[status] || 'gray'}`} />;
}

export function ProgressCircle({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  const color = progress >= 70 ? '#10B981' : progress >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <span className="absolute text-sm font-semibold">{Math.round(progress)}%</span>
    </div>
  );
}

export function ProgressBar({ progress, className }: { progress: number; className?: string }) {
  const color = progress >= 70 ? 'green' : progress >= 40 ? 'orange' : 'red';
  return (
    <div className={`progress-bar ${className || ''}`}>
      <div className={`progress-bar-fill ${color}`} style={{ width: `${progress}%` }} />
    </div>
  );
}

export function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`card p-4 ${onClick ? 'cursor-pointer' : ''} ${className || ''}`} onClick={onClick}>{children}</div>;
}

export function StatCard({ label, value, icon, trend, color }: { label: string; value: string; icon?: React.ReactNode; trend?: { value: string; positive: boolean }; color?: string }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs font-medium text-text-secondary">{label}</p>
          <p className="truncate text-xl font-semibold tracking-tight" style={color ? { color } : undefined}>{value}</p>
          {trend && <p className={`text-xs font-medium ${trend.positive ? 'text-success' : 'text-danger'}`}>{trend.positive ? '↑' : '↓'} {trend.value}</p>}
        </div>
        {icon && <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-surface-secondary text-text-tertiary">{icon}</div>}
      </div>
    </Card>
  );
}

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-[8px] p-4 ${className || ''}`}>{children}</div>;
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`-mb-[1px] whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${active === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          {tab.label}
          {tab.count !== undefined && <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${active === tab.id ? 'bg-primary-50 text-primary' : 'bg-surface-tertiary text-text-secondary'}`}>{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Select({ id, options, value, onChange, className }: { id?: string; options: { label: string; value: string }[]; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)}
      className={`h-9 rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className || ''}`}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[8px] bg-white shadow-modal" onClick={e => e.stopPropagation()}>
        {title && <div className="flex items-center justify-between border-b border-border p-4"><h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function FileUpload({ label, accept, placeholder }: { label: string; accept?: string; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-text-primary">{label}</span>
      <div className="flex h-24 w-full items-center justify-center rounded-[8px] border-2 border-dashed border-border bg-surface-secondary transition-colors hover:border-primary/50 hover:bg-primary-50/30 cursor-pointer">
        <div className="text-center">
          <p className="text-sm text-text-secondary">{placeholder || 'Click to upload or drag and drop'}</p>
          <p className="mt-1 text-xs text-text-tertiary">{accept || 'PDF, PNG, JPG up to 10MB'}</p>
        </div>
      </div>
      <input type="file" className="hidden" accept={accept} />
    </label>
  );
}

export function OtpInput({ length = 6, value, onChange }: { length?: number; value: string; onChange: (val: string) => void }) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;
    const newValue = value.split('');
    newValue[index] = digit;
    const result = newValue.join('').slice(0, length);
    onChange(result);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-12 w-11 rounded-[8px] border border-border bg-white text-center text-lg font-semibold text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      ))}
    </div>
  );
}

export function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-5 w-9 rounded-full p-0.5 transition-colors ${enabled ? 'bg-primary' : 'bg-border'}`}
      >
        <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  );
}
