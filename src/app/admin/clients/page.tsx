import Link from 'next/link';
import { AdminClientsTable } from '@/components/admin/admin-clients-table';
import { getAdminClients, getAdminPayments, getAdminTimelineEvents } from '@/lib/portal-data';

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminClientsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = searchParams ? await searchParams : {};
  const message = firstParam(params, 'message');

  const [clients, payments, timeline] = await Promise.all([
    getAdminClients(),
    getAdminPayments(),
    getAdminTimelineEvents(),
  ]);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Clients</h2>
          <p className="mt-1 text-sm text-text-secondary">Manage profile details, payments, and timeline records from one client drawer.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/payments" className="inline-flex h-9 items-center rounded-[8px] border border-border bg-white px-3 text-sm font-medium text-text-secondary hover:bg-surface-tertiary">Payments</Link>
          <Link href="/admin/timeline" className="inline-flex h-9 items-center rounded-[8px] border border-border bg-white px-3 text-sm font-medium text-text-secondary hover:bg-surface-tertiary">Timeline</Link>
        </div>
      </div>

      {message && <p className="rounded-[8px] border border-primary/20 bg-primary-50 px-3 py-2 text-sm font-medium text-primary">{message}</p>}

      <AdminClientsTable clients={clients} payments={payments} timeline={timeline} />
    </div>
  );
}
