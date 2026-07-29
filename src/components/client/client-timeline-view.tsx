'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, CheckCircle2, Clock, CreditCard, FileText, Milestone as MilestoneIcon, RefreshCw } from 'lucide-react';
import type { ClientTimelineEventRecord, TimelineEventStatusValue, TimelineEventTypeValue } from '@/lib/portal-data';
import { Drawer } from '@/components/ui/slide-panel';
import { Badge, Card } from '@/components/ui/shared';

const typeLabel: Record<TimelineEventTypeValue, string> = {
  milestone: 'Milestone',
  meeting: 'Meeting',
  payment: 'Payment',
  document: 'Document',
  update: 'Update',
};

const typeBadge: Record<TimelineEventTypeValue, 'purple' | 'green' | 'orange' | 'gray'> = {
  milestone: 'purple',
  meeting: 'green',
  payment: 'orange',
  document: 'gray',
  update: 'purple',
};

const statusBadge: Record<TimelineEventStatusValue, 'orange' | 'green' | 'gray'> = {
  upcoming: 'orange',
  completed: 'green',
  cancelled: 'gray',
};

const iconByType: Record<TimelineEventTypeValue, ReactNode> = {
  milestone: <MilestoneIcon size={16} />,
  meeting: <CalendarDays size={16} />,
  payment: <CreditCard size={16} />,
  document: <FileText size={16} />,
  update: <RefreshCw size={16} />,
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function relativeLabel(value: string) {
  const now = new Date();
  const date = new Date(value);
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1) return `${diffDays} days away`;
  if (diffDays === -1) return 'Yesterday';
  return `${Math.abs(diffDays)} days ago`;
}

export function ClientTimelineView({ events }: { events: ClientTimelineEventRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEvent = events.find((event) => event.id === selectedId);
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()),
    [events],
  );
  const upcoming = events.filter((event) => event.status === 'upcoming');
  const completed = events.filter((event) => event.status === 'completed');
  const nextStep = sortedEvents.find((event) => event.status === 'upcoming');

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <p className="text-sm text-text-secondary">Next step</p>
          <p className="mt-1 truncate text-lg font-semibold text-text-primary">{nextStep?.title ?? 'No upcoming step'}</p>
          <p className="mt-1 text-xs text-text-tertiary">{nextStep ? relativeLabel(nextStep.eventDate) : 'Admin has not added a next step yet.'}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Upcoming</p>
          <p className="mt-1 text-2xl font-semibold text-warning">{upcoming.length}</p>
          <p className="mt-1 text-xs text-text-tertiary">Visible client events</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-success">{completed.length}</p>
          <p className="mt-1 text-xs text-text-tertiary">Finished milestones and updates</p>
        </Card>
      </div>

      <section className="card p-0">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text-primary">Project Activity</h2>
          <p className="mt-1 text-sm text-text-secondary">Admin-published updates, sorted by event date.</p>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center text-text-secondary">
            <Clock className="mb-3 text-text-tertiary" size={26} />
            <p className="text-sm font-medium text-text-primary">No visible timeline events yet</p>
            <p className="mt-1 text-sm">Your project updates will appear here once the admin publishes them.</p>
          </div>
        ) : (
          <div className="px-5 py-4">
            <div className="relative space-y-4 before:absolute before:bottom-3 before:left-4 before:top-3 before:w-px before:bg-border">
              {sortedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedId(event.id)}
                  className="relative grid w-full grid-cols-[36px_1fr] gap-3 text-left"
                >
                  <span className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-sm ${
                    event.status === 'completed' ? 'bg-success text-white' : event.status === 'cancelled' ? 'bg-surface-tertiary text-text-tertiary' : 'bg-primary text-white'
                  }`}>
                    {event.status === 'completed' ? <CheckCircle2 size={16} /> : iconByType[event.type]}
                  </span>
                  <span className="rounded-[8px] border border-border bg-white p-4 transition hover:border-primary/30 hover:bg-primary-50/30">
                    <span className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <span className="min-w-0">
                        <span className="block font-semibold text-text-primary">{event.title}</span>
                        <span className="mt-1 line-clamp-2 block text-sm text-text-secondary">{event.description || 'No additional details.'}</span>
                      </span>
                      <span className="flex shrink-0 flex-wrap gap-2">
                        <Badge variant={typeBadge[event.type]}>{typeLabel[event.type]}</Badge>
                        <Badge variant={statusBadge[event.status]}>{event.status}</Badge>
                      </span>
                    </span>
                    <span className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                      <span>{formatDate(event.eventDate)}</span>
                      <span>{relativeLabel(event.eventDate)}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <Drawer
        open={Boolean(selectedEvent)}
        title={selectedEvent?.title ?? 'Timeline event'}
        description={selectedEvent ? `${typeLabel[selectedEvent.type]} - ${formatDateTime(selectedEvent.eventDate)}` : undefined}
        onClose={() => setSelectedId(null)}
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={typeBadge[selectedEvent.type]}>{typeLabel[selectedEvent.type]}</Badge>
              <Badge variant={statusBadge[selectedEvent.status]}>{selectedEvent.status}</Badge>
            </div>
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">Details</h3>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Event date</p>
                  <p className="mt-1 text-text-primary">{formatDateTime(selectedEvent.eventDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Created</p>
                  <p className="mt-1 text-text-primary">{formatDateTime(selectedEvent.createdAt)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-text-tertiary">Description</p>
                  <p className="mt-1 leading-6 text-text-primary">{selectedEvent.description || 'No additional details.'}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </>
  );
}
