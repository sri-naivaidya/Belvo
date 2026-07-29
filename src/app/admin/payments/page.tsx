import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { AdminPaymentsTable } from '@/components/admin/admin-payments-table';
import { getAdminClients, getAdminPayments, getPaymentSettings, isPaymentStatus, paymentStatuses } from '@/lib/portal-data';
import { formatCurrency } from '@/lib/money';

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

export default async function AdminPaymentsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = searchParams ? await searchParams : {};
  const selectedClientId = firstParam(params, 'clientId') || '';
  const selectedStatusInput = firstParam(params, 'status');
  const selectedStatus = isPaymentStatus(selectedStatusInput) ? selectedStatusInput : undefined;
  const message = firstParam(params, 'message');
  const error = firstParam(params, 'error');

  const [clients, payments, paymentSettings] = await Promise.all([
    getAdminClients(),
    getAdminPayments({ clientId: selectedClientId || undefined, status: selectedStatus }),
    getPaymentSettings(),
  ]);

  const paidTotal = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingTotal = payments.filter((payment) => payment.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const overdueTotal = payments.filter((payment) => payment.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Payments</h2>
          <p className="mt-1 text-sm text-text-secondary">Create, edit, and track client payment records.</p>
        </div>
        <Link href="/admin/clients" className="inline-flex h-9 items-center justify-center rounded-[8px] border border-border bg-white px-3.5 text-sm font-medium text-text-secondary hover:bg-surface-tertiary">
          View clients
        </Link>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm font-medium text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm font-medium text-danger">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Paid</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">{formatCurrency(paidTotal)}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-success-50 text-success"><CheckCircle2 size={18} /></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Pending</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">{formatCurrency(pendingTotal)}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-warning-50 text-warning"><Clock size={18} /></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Overdue</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">{formatCurrency(overdueTotal)}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-danger-50 text-danger"><AlertTriangle size={18} /></div>
          </div>
        </div>
      </div>

      <section className="card p-4">
        <form className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto_auto]" method="get">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Client</span>
            <select name="clientId" defaultValue={selectedClientId} className={inputClass()}>
              <option value="">All clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.fullName || client.email}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Status</span>
            <select name="status" defaultValue={selectedStatus ?? ''} className={inputClass()}>
              <option value="">All statuses</option>
              {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <button type="submit" className="mt-auto inline-flex h-9 items-center justify-center rounded-[8px] bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-600">
            Filter
          </button>
          <Link href="/admin/payments" className="mt-auto inline-flex h-9 items-center justify-center rounded-[8px] border border-border bg-white px-3.5 text-sm font-medium text-text-secondary hover:bg-surface-tertiary">
            Reset
          </Link>
        </form>
      </section>

      <AdminPaymentsTable payments={payments} clients={clients} paymentSettings={paymentSettings} />
    </div>
  );
}
