'use client';

import { useMemo, useState } from 'react';
import { CalendarRange, Eye, EyeOff, Plus, Sparkles, Trash2 } from 'lucide-react';
import { createTimelineEventAction, deleteTimelineEventAction, updateTimelineEventAction } from '@/lib/admin-actions';
import {
  timelineEventStatuses,
  timelineEventTypes,
  type AdminClientRecord,
  type AdminTimelineEventRecord,
  type TimelineEventStatusValue,
  type TimelineEventTypeValue,
} from '@/lib/portal-data';
import { Drawer } from '@/components/ui/slide-panel';
import { FormSubmitButton } from '@/components/ui/form-submit-button';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function toDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function statusBadge(status: TimelineEventStatusValue) {
  if (status === 'completed') return 'badge-green';
  if (status === 'upcoming') return 'badge-orange';
  return 'badge-gray';
}

function typeBadge(type: TimelineEventTypeValue) {
  if (type === 'milestone' || type === 'update') return 'badge-purple';
  if (type === 'meeting') return 'badge-green';
  if (type === 'payment') return 'badge-orange';
  return 'badge-gray';
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

function textareaClass() {
  return 'min-h-24 w-full rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';
}

function TimelineForm({ event, clients }: { event?: AdminTimelineEventRecord; clients: AdminClientRecord[] }) {
  return (
    <form action={event ? updateTimelineEventAction : createTimelineEventAction} className="space-y-4">
      {event && <input type="hidden" name="id" value={event.id} />}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Client</span>
          <select name="clientId" required defaultValue={event?.clientId ?? ''} className={inputClass()}>
            <option value="" disabled>Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.fullName || client.email}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Title</span>
          <input name="title" required defaultValue={event?.title ?? ''} placeholder="Timeline title" className={inputClass()} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Type</span>
          <select name="type" defaultValue={event?.type ?? 'update'} className={inputClass()}>
            {timelineEventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Status</span>
          <select name="status" defaultValue={event?.status ?? 'upcoming'} className={inputClass()}>
            {timelineEventStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Event date</span>
          <input name="eventDate" required type="datetime-local" defaultValue={event ? toDateTimeLocal(event.eventDate) : ''} className={inputClass()} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Description</span>
          <textarea name="description" defaultValue={event?.description ?? ''} placeholder="Optional event detail" className={textareaClass()} />
        </label>
        <label className="flex h-9 items-center gap-2 rounded-[8px] border border-border bg-white px-3 text-sm font-medium text-text-secondary">
          <input name="visibleToClient" type="checkbox" defaultChecked={event?.visibleToClient ?? true} className="h-4 w-4 accent-primary" />
          Visible to client
        </label>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        {event && (
          <FormSubmitButton formAction={deleteTimelineEventAction} pendingLabel="Deleting..." className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-danger/20 bg-danger-50 px-3.5 text-sm font-medium text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60">
            <Trash2 size={14} />
            Delete
          </FormSubmitButton>
        )}
        <FormSubmitButton pendingLabel={event ? 'Saving...' : 'Creating...'} disabled={!event && clients.length === 0} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
          {event ? 'Save event' : 'Create event'}
        </FormSubmitButton>
      </div>
    </form>
  );
}

const quickTemplates = [
  {
    title: 'Discovery call completed',
    description: 'Initial discovery discussion is complete. Requirements, goals, and next steps have been captured for planning.',
    type: 'meeting' as TimelineEventTypeValue,
    status: 'completed' as TimelineEventStatusValue,
  },
  {
    title: 'Documents received',
    description: 'Required onboarding documents have been received and are under review by the Belvo team.',
    type: 'document' as TimelineEventTypeValue,
    status: 'completed' as TimelineEventStatusValue,
  },
  {
    title: 'Payment requested',
    description: 'A payment request has been created for the next project milestone. Please complete payment from the Payments page.',
    type: 'payment' as TimelineEventTypeValue,
    status: 'upcoming' as TimelineEventStatusValue,
  },
  {
    title: 'Design review scheduled',
    description: 'A design review session has been scheduled to review direction, feedback, and approval checkpoints.',
    type: 'meeting' as TimelineEventTypeValue,
    status: 'upcoming' as TimelineEventStatusValue,
  },
  {
    title: 'First draft delivery',
    description: 'The first working draft is scheduled for client review. Feedback from this round will guide final revisions.',
    type: 'milestone' as TimelineEventTypeValue,
    status: 'upcoming' as TimelineEventStatusValue,
  },
];

function defaultEventDate(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(10, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

function QuickTemplates({ clients }: { clients: AdminClientRecord[] }) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [eventDate, setEventDate] = useState(defaultEventDate(1));

  return (
    <section className="card p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary-50 text-primary">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Quick Timeline Templates</h3>
            <p className="mt-0.5 text-xs text-text-secondary">Pick a client and create common project updates without filling the drawer form.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[520px]">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Client</span>
            <select value={clientId} onChange={(event) => setClientId(event.target.value)} className={inputClass()}>
              {clients.length === 0 ? (
                <option value="">No clients</option>
              ) : clients.map((client) => (
                <option key={client.id} value={client.id}>{client.fullName || client.email}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Event date</span>
            <input type="datetime-local" value={eventDate} onChange={(event) => setEventDate(event.target.value)} className={inputClass()} />
          </label>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {quickTemplates.map((template) => (
          <form key={template.title} action={createTimelineEventAction} className="rounded-[8px] border border-border bg-white p-3">
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="title" value={template.title} />
            <input type="hidden" name="description" value={template.description} />
            <input type="hidden" name="type" value={template.type} />
            <input type="hidden" name="status" value={template.status} />
            <input type="hidden" name="eventDate" value={eventDate} />
            <input type="hidden" name="visibleToClient" value="on" />
            <p className="text-sm font-semibold text-text-primary">{template.title}</p>
            <p className="mt-1 line-clamp-2 min-h-8 text-xs text-text-secondary">{template.description}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className={`badge ${typeBadge(template.type)}`}>{template.type}</span>
              <FormSubmitButton pendingLabel="Adding..." disabled={!clientId || !eventDate} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[8px] bg-primary px-3 text-xs font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
                Add
              </FormSubmitButton>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}

export function AdminTimelineTable({ events, clients }: { events: AdminTimelineEventRecord[]; clients: AdminClientRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedId), [events, selectedId]);
  const creating = selectedId === 'new';

  return (
    <>
      <QuickTemplates clients={clients} />

      <section className="card overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Timeline Events</h3>
            <p className="mt-0.5 text-xs text-text-secondary">Open a row to edit visibility, status, and event details.</p>
          </div>
          <button type="button" onClick={() => setSelectedId('new')} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-600">
            <Plus size={15} />
            New event
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Event</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Client</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Type</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Visibility</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Date</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-text-secondary" colSpan={6}>
                    <CalendarRange className="mx-auto mb-2 text-text-tertiary" size={22} />
                    No timeline events found.
                  </td>
                </tr>
              ) : events.map((event) => (
                <tr key={event.id} onClick={() => setSelectedId(event.id)} className="cursor-pointer border-b border-border/60 transition-colors hover:bg-primary-50/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{event.title}</p>
                    <p className="mt-0.5 max-w-[320px] truncate text-xs text-text-secondary">{event.description || 'No description'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{event.clientName}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{event.clientEmail}</p>
                  </td>
                  <td className="px-4 py-3"><span className={`badge ${typeBadge(event.type)}`}>{event.type}</span></td>
                  <td className="px-4 py-3"><span className={`badge ${statusBadge(event.status)}`}>{event.status}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${event.visibleToClient ? 'bg-success-50 text-success' : 'bg-surface-tertiary text-text-secondary'}`}>
                      {event.visibleToClient ? <Eye size={12} /> : <EyeOff size={12} />}
                      {event.visibleToClient ? 'visible' : 'hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDateTime(event.eventDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Drawer
        open={creating || Boolean(selectedEvent)}
        title={creating ? 'Create Timeline Event' : selectedEvent?.title ?? 'Timeline event'}
        description={creating ? 'Add a client-visible or internal timeline entry.' : selectedEvent ? `${selectedEvent.clientName} - ${formatDateTime(selectedEvent.eventDate)}` : undefined}
        onClose={() => setSelectedId(null)}
      >
        <TimelineForm event={selectedEvent} clients={clients} />
      </Drawer>
    </>
  );
}
