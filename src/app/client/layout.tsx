'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import {
  LayoutDashboard,
  FolderKanban,
  Milestone,
  ClipboardCheck,
  CalendarRange,
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  GitCompareArrows,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/shared';
import { PageLoader } from '@/components/ui/page-loader';

type Profile = { full_name: string | null; email: string; role: 'admin' | 'client' };

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/client/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Projects', href: '/client/projects', icon: <FolderKanban size={18} /> },
  { label: 'Milestones', href: '/client/milestones', icon: <Milestone size={18} /> },
  { label: 'Verification', href: '/client/verification', icon: <ClipboardCheck size={18} /> },
  { label: 'Timeline', href: '/client/timeline', icon: <CalendarRange size={18} /> },
  { label: 'Meetings', href: '/client/meetings', icon: <Calendar size={18} /> },
  { label: 'Payments', href: '/client/payments', icon: <CreditCard size={18} /> },
  { label: 'Documents', href: '/client/documents', icon: <FileText size={18} /> },
  { label: 'Chat', href: '/client/chat', icon: <MessageSquare size={18} /> },
  { label: 'Change Requests', href: '/client/changes', icon: <GitCompareArrows size={18} /> },
  { label: 'Reports', href: '/client/reports', icon: <BarChart3 size={18} /> },
  { label: 'Settings', href: '/client/settings', icon: <Settings size={18} /> },
];

function Sidebar({
  open,
  onClose,
  pathname,
  profile,
  onSignOut,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  profile: Profile | null;
  onSignOut: () => void;
  onNavigate: (href: string) => void;
}) {
  const displayName = profile?.full_name || profile?.email || 'Client';
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-60 flex-col bg-[#0F172A] text-white transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-4">
          <Link href="/client/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
              B
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight">Belvo Portal</span>
              <span className="block text-[10px] text-white/40 font-medium tracking-wide uppercase">
                Client Portal
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3 scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const badge = item.badge;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-150
                  ${
                    active
                      ? 'bg-purple-600/20 text-purple-300 shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span
                  className={`shrink-0 transition-colors duration-150 ${
                    active ? 'text-purple-300' : 'text-white/40 group-hover:text-white/70'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-purple-500/20 text-purple-300">
                    {badge}
                  </span>
                )}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-300 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/5 p-3">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-[11px] text-white/40 truncate">Client account</p>
            </div>
            <button onClick={onSignOut} aria-label="Sign out" className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({
  onMenuToggle,
  sidebarOpen,
  profile,
  onSignOut,
  onNavigate,
}: {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  profile: Profile | null;
  onSignOut: () => void;
  onNavigate: (href: string) => void;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = profile?.full_name || profile?.email || 'Client';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/85 px-4 shadow-sm backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <p className="hidden text-sm font-medium text-text-secondary sm:block">Client workspace</p>
      </div>

      <div className="flex items-center gap-2">
        <Bell size={20} className="hidden text-text-tertiary sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 rounded-[8px] p-1.5 pr-3 transition-colors hover:bg-surface-tertiary"
          >
            <Avatar name={displayName} size="sm" />
            <span className="hidden text-sm font-medium text-text-primary sm:block">{displayName.split(' ')[0]}</span>
            <ChevronDown
              size={14}
              className={`text-text-tertiary transition-transform duration-200 ${
                showUserMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 animate-fade-in rounded-[8px] border border-border bg-white p-1.5 shadow-dropdown">
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                <p className="text-xs text-text-secondary">{profile?.email || ''}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/client/settings"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:bg-surface-tertiary rounded-lg transition-colors"
                >
                  <Settings size={16} className="text-text-secondary" />
                  Settings
                </Link>
                <button
                  onClick={() => { setShowUserMenu(false); onSignOut(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pathname, navigate] = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          navigate('/client/login');
          return;
        }
        const data = await response.json() as { user: { fullName: string | null; email: string; role: 'admin' | 'client' } };
        setProfile({ full_name: data.user.fullName, email: data.user.email, role: data.user.role });
      } catch {
        navigate('/client/login');
      }
    }
    void loadProfile();
  }, []);

  useEffect(() => {
    if (navigationTarget) {
      navigate(navigationTarget);
      setNavigationTarget(null);
    }
  }, [navigationTarget, navigate]);

  function startNavigation(href: string) {
    if (href !== pathname) setNavigationTarget(href);
  }

  const navigating = navigationTarget !== null && navigationTarget !== pathname;

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/client/login';
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {navigating && <PageLoader label="Loading page..." />}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pathname={pathname}
        profile={profile}
        onSignOut={signOut}
        onNavigate={startNavigation}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          profile={profile}
          onSignOut={signOut}
          onNavigate={startNavigation}
        />

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 lg:px-6 lg:py-5">{children}</main>
      </div>
    </div>
  );
}
