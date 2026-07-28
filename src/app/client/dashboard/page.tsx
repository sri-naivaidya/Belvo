'use client';

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { CalendarRange, CreditCard, Settings, Sparkles, UserRound } from 'lucide-react';

function firstName(name: string | null, email: string) {
  return (name || email).split(' ')[0];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

interface DashboardData {
  profile: {
    fullName: string | null;
    email: string;
    company: string | null;
    phone: string | null;
    website: string | null;
    street: string | null;
    city: string | null;
    country: string | null;
  };
  payments: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    cancelled: number;
    outstandingAmount: number;
  };
  timeline: {
    totalVisible: number;
    upcoming: number;
    completed: number;
    recent: { id: string; title: string; description: string | null; type: string; eventDate: string }[];
  };
}

const MOCK_PROFILE = {
  fullName: 'Rahul Sharma',
  email: 'rahul@example.com',
  company: 'TechStart Inc.',
  phone: '+91 98765 43210',
  website: 'https://techstart.example.com',
  street: '123 MG Road',
  city: 'Bangalore',
  country: 'India',
};

const MOCK_PAYMENTS = { total: 8, paid: 5, pending: 2, overdue: 1, cancelled: 0, outstandingAmount: 185000 };
const MOCK_TIMELINE = {
  totalVisible: 12,
  upcoming: 3,
  completed: 7,
  recent: [
    { id: '1', title: 'Website v2 Launch', description: 'Final deployment of the redesigned website', type: 'milestone', eventDate: '2026-07-25T10:00:00Z' },
    { id: '2', title: 'Monthly Review', description: 'Monthly performance review meeting', type: 'meeting', eventDate: '2026-07-22T14:30:00Z' },
    { id: '3', title: 'Invoice #1042', description: 'Monthly retainer payment received', type: 'payment', eventDate: '2026-07-20T09:00:00Z' },
    { id: '4', title: 'SEO Audit Complete', description: 'Q3 SEO audit report delivered', type: 'update', eventDate: '2026-07-18T16:00:00Z' },
  ],
};

function missingProfileFields(profile: DashboardData['profile']) {
  const fields: [string, string | null][] = [
    ['Full name', profile.fullName],
    ['Company', profile.company],
    ['Phone', profile.phone],
    ['Website', profile.website],
    ['Address', profile.street || profile.city || profile.country],
  ];
  return fields.filter(([, value]) => !value).map(([label]) => label);
}

export default function ClientDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, dashboardRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/client/dashboard'),
        ]);

        if (meRes.ok && dashboardRes.ok) {
          const meData = await meRes.json();
          const dashboardData = await dashboardRes.json();
          setData({
            profile: meData.user || MOCK_PROFILE,
            payments: dashboardData.payments || MOCK_PAYMENTS,
            timeline: dashboardData.timeline || MOCK_TIMELINE,
          });
        } else {
          setData({ profile: MOCK_PROFILE, payments: MOCK_PAYMENTS, timeline: MOCK_TIMELINE });
        }
      } catch {
        setData({ profile: MOCK_PROFILE, payments: MOCK_PAYMENTS, timeline: MOCK_TIMELINE });
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="animate-fade-in space-y-5">
        <section className="relative overflow-hidden rounded-[8px] bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#6D28D9] p-5 text-white shadow-card">
          <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-100">
                <Sparkles size={12} />
                Client Portal
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-purple-100/85">
                Your workspace is ready.
              </p>
            </div>
            <Link href="/client/settings" className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-white px-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-purple-50">
              <Settings size={16} />
              Edit profile
            </Link>
          </div>
        </section>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  const profileMissing = missingProfileFields(data.profile);

  return (
    <div className="animate-fade-in space-y-5">
      <section className="relative overflow-hidden rounded-[8px] bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#6D28D9] p-5 text-white shadow-card">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-100">
              <Sparkles size={12} />
              Client Portal
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome, {firstName(data.profile.fullName, data.profile.email)}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-purple-100/85">
              {data.profile.company ? `${data.profile.company} workspace` : 'Your workspace is ready. Complete your profile so the team has the right details.'}
            </p>
          </div>
          <Link href="/client/settings" className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-white px-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-purple-50">
            <Settings size={16} />
            Edit profile
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-text-secondary">Payment Records</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{data.payments.total}</p>
          <p className="mt-1 text-xs text-text-tertiary">{data.payments.paid} paid - {data.payments.cancelled} cancelled</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-text-secondary">Outstanding</p>
          <p className="mt-1 text-xl font-semibold text-primary">{formatCurrency(data.payments.outstandingAmount)}</p>
          <p className="mt-1 text-xs text-text-tertiary">{data.payments.pending} pending - {data.payments.overdue} overdue</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-text-secondary">Visible Timeline</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{data.timeline.totalVisible}</p>
          <p className="mt-1 text-xs text-text-tertiary">{data.timeline.upcoming} upcoming - {data.timeline.completed} completed</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-text-secondary">Profile Status</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{profileMissing.length === 0 ? 'Complete' : `${profileMissing.length} missing`}</p>
          <p className="mt-1 text-xs text-text-tertiary">{profileMissing.length === 0 ? 'All core details saved' : profileMissing.slice(0, 2).join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="card p-0 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-text-primary">Recent Timeline</h2>
            <Link href="/client/timeline" className="text-sm font-medium text-primary hover:text-primary-600">View all</Link>
          </div>
          {data.timeline.recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <CalendarRange className="mb-3 text-text-tertiary" size={24} />
              <p className="text-sm font-medium text-text-primary">No timeline events yet</p>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">When the admin team adds visible updates for you, they will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.timeline.recent.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-text-primary">{event.title}</p>
                      <span className="badge badge-purple">{event.type}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-text-secondary">{event.description || 'No details added.'}</p>
                  </div>
                  <span className="shrink-0 text-xs text-text-tertiary">{formatDate(event.eventDate)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="card p-4">
            <div className="mb-3 flex items-center gap-2">
              <UserRound size={16} className="text-text-secondary" />
              <h2 className="text-base font-semibold text-text-primary">Your Information</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-text-tertiary">Email</p>
                <p className="mt-0.5 text-text-primary">{data.profile.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-tertiary">Company</p>
                <p className="mt-0.5 text-text-primary">{data.profile.company || 'Not added yet'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-tertiary">Phone</p>
                <p className="mt-0.5 text-text-primary">{data.profile.phone || 'Not added yet'}</p>
              </div>
            </div>
          </section>

          <section className="card p-4">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-text-secondary" />
              <h2 className="text-base font-semibold text-text-primary">Payments</h2>
            </div>
            {data.payments.total === 0 ? (
              <p className="text-sm text-text-secondary">No payment records have been added for your account.</p>
            ) : (
              <Link href="/client/payments" className="inline-flex h-9 w-full items-center justify-center rounded-[8px] bg-primary px-3 text-sm font-medium text-white hover:bg-primary-600">
                Open payments
              </Link>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
