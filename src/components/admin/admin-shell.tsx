'use client';

import type { ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import {
  Calendar,
  CalendarRange,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UsersRound,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/shared';
import { PageLoader } from '@/components/ui/page-loader';
type AdminUser = {
  email: string;
  fullName: string | null;
};

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Clients', href: '/admin/clients', icon: <UsersRound size={18} /> },
  { label: 'Payments', href: '/admin/payments', icon: <CreditCard size={18} /> },
  { label: 'Meetings', href: '/admin/meetings', icon: <Calendar size={18} /> },
  { label: 'Timeline', href: '/admin/timeline', icon: <CalendarRange size={18} /> },
  { label: 'Verification', href: '/admin/verification', icon: <ClipboardCheck size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

function pageTitle(pathname: string) {
  const item = navItems.find((navItem) => pathname === navItem.href || pathname.startsWith(`${navItem.href}/`));
  return item?.label ?? 'Admin';
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [pathname, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) return;
        const data = await response.json() as { user: { fullName: string | null; email: string } };
        setUser(data.user);
      } catch {}
    }
    void loadProfile();
  }, []);

  useEffect(() => {
    if (navigationTarget) {
      navigate(navigationTarget);
      setNavigationTarget(null);
    }
  }, [navigationTarget, navigate]);

  const displayName = user?.fullName || user?.email || 'Admin';

  function startNavigation(href: string) {
    if (href !== pathname) setNavigationTarget(href);
  }

  const navigating = navigationTarget !== null && navigationTarget !== pathname;

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    navigate('/');
    window.location.reload();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {navigating && <PageLoader label="Loading page..." />}

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-56 flex-col bg-[#0F172A] text-white transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/5 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-purple-500/20">
              B
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Belvo Portal</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/40">Admin</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="ml-auto p-1.5 text-white/40 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { setOpen(false); startNavigation(item.href); }}
                className={`group flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-purple-600/20 text-purple-300 shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`shrink-0 ${active ? 'text-purple-300' : 'text-white/40 group-hover:text-white/70'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300" />}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="shrink-0 border-t border-white/5 p-3">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="truncate text-[11px] text-white/40">Admin account</p>
            </div>
            <button onClick={signOut} aria-label="Sign out" className="rounded-lg p-1.5 text-white/30 hover:text-white hover:bg-white/10">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white/85 px-4 shadow-sm backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-surface-tertiary lg:hidden"
              aria-label="Toggle sidebar"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="text-sm font-medium text-text-secondary">{pageTitle(pathname)}</p>
          </div>

          <button onClick={signOut} className="flex items-center gap-2 rounded-[8px] px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors">
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 lg:px-6 lg:py-5">{children}</main>
      </div>
    </div>
  );
}
