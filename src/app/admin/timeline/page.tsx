import Link from 'next/link';
import { AdminTimelineTable } from '@/components/admin/admin-timeline-table';
import {
  getAdminClients,
  getAdminTimelineEvents,
  isTimelineEventStatus,
  isTimelineEventType,
  timelineEventStatuses,
  timelineEventTypes,
} from '@/lib/portal-data';

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

export default async function AdminTimelinePage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = searchParams ? await searchParams : {};
  const selectedClientId = firstParam(params, 'clientId') || '';
  const selectedTypeInput = firstParam(params, 'type');
  const selectedType = isTimelineEventType(selectedTypeInput) ? selectedTypeInput : undefined;
  const selectedStatusInput = firstParam(params, 'status');
  const selectedStatus = isTimelineEventStatus(selectedStatusInput) ? selectedStatusInput : undefined;
  const message = firstParam(params, 'message');
  const error = firstParam(params, 'error');

  const [clients, events] = await Promise.all([
    getAdminClients(),
    getAdminTimelineEvents({ clientId: selectedClientId || undefined, type: selectedType, status: selectedStatus }),
  ]);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Timeline</h2>
          <p className="mt-1 text-sm text-text-secondary">Control client-visible updates, milestones, meetings, documents, and payment events.</p>
        </div>
        <Link href="/client/timeline" className="inline-flex h-9 items-center justify-center rounded-[8px] border border-border bg-white px-3.5 text-sm font-medium text-text-secondary hover:bg-surface-tertiary">
          Client view
        </Link>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm font-medium text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm font-medium text-danger">{error}</p>}

      <section className="card p-4">
        <form className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px_auto_auto]" method="get">
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
            <span className="text-xs font-medium text-text-secondary">Type</span>
            <select name="type" defaultValue={selectedType ?? ''} className={inputClass()}>
              <option value="">All types</option>
              {timelineEventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Status</span>
            <select name="status" defaultValue={selectedStatus ?? ''} className={inputClass()}>
              <option value="">All statuses</option>
              {timelineEventStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <button type="submit" className="mt-auto inline-flex h-9 items-center justify-center rounded-[8px] bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-600">
            Filter
          </button>
          <Link href="/admin/timeline" className="mt-auto inline-flex h-9 items-center justify-center rounded-[8px] border border-border bg-white px-3.5 text-sm font-medium text-text-secondary hover:bg-surface-tertiary">
            Reset
          </Link>
        </form>
      </section>

      <AdminTimelineTable events={events} clients={clients} />
    </div>
  );
}
