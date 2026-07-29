import Link from 'next/link';
import { AlertTriangle, CalendarRange, Clock, CreditCard, UsersRound } from 'lucide-react';
import { getAdminDashboardData } from '@/lib/portal-data';
import { formatCurrency } from '@/lib/money';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function badgeClass(status: string) {
  if (status === 'paid' || status === 'completed') return 'badge-green';
  if (status === 'pending' || status === 'upcoming') return 'badge-orange';
  if (status === 'overdue' || status === 'cancelled') return 'badge-red';
  return 'badge-gray';
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const stats = [
    { label: 'Total clients', value: String(data.totalClients), icon: <UsersRound size={18} />, tone: 'text-primary' },
    { label: 'Pending payments', value: String(data.pendingPayments), icon: <Clock size={18} />, tone: 'text-warning' },
    { label: 'Overdue payments', value: String(data.overduePayments), icon: <AlertTriangle size={18} />, tone: 'text-danger' },
    { label: 'Outstanding', value: formatCurrency(data.outstandingAmount), icon: <CreditCard size={18} />, tone: 'text-primary' },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Admin Dashboard</h2>
          <p className="mt-1 text-sm text-text-secondary">Manage client payments, timeline visibility, and operational updates.</p>
        </div>
        <Link href="/admin/payments" className="inline-flex h-9 items-center justify-center rounded-[8px] bg-primary px-3.5 text-sm font-medium text-white shadow-sm hover:bg-primary-600">
          Add payment
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-text-primary">{stat.value}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-[8px] bg-surface-secondary ${stat.tone}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-base font-semibold text-text-primary">Recent Payments</h3>
            <Link href="/admin/payments" className="text-sm font-medium text-primary hover:text-primary-600">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentPayments.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-secondary">No payments yet.</p>
            ) : data.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{payment.title}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">{payment.clientName} - {payment.dueDate ? formatDate(payment.dueDate) : 'No due date'}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-text-primary">{formatCurrency(payment.amount, payment.currency)}</p>
                  <span className={`badge ${badgeClass(payment.status)}`}>{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-base font-semibold text-text-primary">Recent Timeline</h3>
            <Link href="/admin/timeline" className="text-sm font-medium text-primary hover:text-primary-600">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentTimelineEvents.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-secondary">No timeline events yet.</p>
            ) : data.recentTimelineEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-primary-50 text-primary">
                  <CalendarRange size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-text-primary">{event.title}</p>
                    <span className={`badge ${badgeClass(event.status)}`}>{event.status}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">{event.clientName} - {formatDate(event.eventDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
