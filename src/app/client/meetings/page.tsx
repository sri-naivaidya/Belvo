'use client';

import { CalendarDays, CheckCircle2, Clock, ExternalLink, Trash2, XCircle } from 'lucide-react';
import { Badge, Card, StatCard } from '@/components/ui/shared';
import { FormSubmitButton } from '@/components/ui/form-submit-button';
import { useState, useEffect } from 'react';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type MeetingStatus = 'upcoming' | 'accepted' | 'cancelled' | 'completed';

interface MeetingRecord {
  id: string;
  title: string;
  status: MeetingStatus;
  scheduledAt: string;
  durationMinutes: number;
  agenda: string | null;
  participants: string | null;
  meetingLink: string | null;
}

function statusVariant(status: MeetingStatus): 'purple' | 'green' | 'red' | 'gray' {
  if (status === 'accepted') return 'green';
  if (status === 'cancelled') return 'red';
  if (status === 'completed') return 'gray';
  return 'purple';
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

export default function MeetingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);

  useEffect(() => {
    const mockMeetings: MeetingRecord[] = [
      {
        id: 'mock-meeting-1',
        title: 'Sprint Review',
        status: 'upcoming',
        scheduledAt: '2026-08-05T10:00:00.000Z',
        durationMinutes: 45,
        agenda: 'Review sprint progress and demo new features.',
        participants: 'rahul@example.com, admin@belvo.com',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      },
      {
        id: 'mock-meeting-2',
        title: 'Project Kickoff',
        status: 'accepted',
        scheduledAt: '2026-07-28T14:30:00.000Z',
        durationMinutes: 60,
        agenda: 'Kickoff meeting for the new website redesign.',
        participants: 'rahul@example.com, admin@belvo.com, designer@belvo.com',
        meetingLink: null,
      },
    ];
    setMeetings(mockMeetings);
  }, []);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Meetings</h1>
        <p className="mt-1 text-sm text-text-secondary">Schedule and manage meetings saved to your account.</p>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={String(meetings.length)} icon={<CalendarDays size={18} />} />
        <StatCard label="Upcoming" value={String(meetings.filter((meeting) => meeting.status === 'upcoming').length)} icon={<Clock size={18} />} />
        <StatCard label="Accepted" value={String(meetings.filter((meeting) => meeting.status === 'accepted').length)} icon={<CheckCircle2 size={18} />} color="#10B981" />
        <StatCard label="Cancelled" value={String(meetings.filter((meeting) => meeting.status === 'cancelled').length)} icon={<XCircle size={18} />} color="#EF4444" />
      </div>

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-text-primary">Schedule Meeting</h2>
          <p className="mt-1 text-sm text-text-secondary">Create a meeting request for the admin team.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }} className="grid gap-4 lg:grid-cols-[1fr_140px_120px_140px]">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Title</span>
            <input name="title" required className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Date</span>
            <input name="date" type="date" required className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Time</span>
            <input name="time" type="time" required className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Duration</span>
            <select name="durationMinutes" defaultValue="45" className={inputClass()}>
              {[15, 30, 45, 60, 90].map((duration) => <option key={duration} value={duration}>{duration} min</option>)}
            </select>
          </label>
          <label className="space-y-1.5 lg:col-span-2">
            <span className="text-xs font-medium text-text-secondary">Agenda</span>
            <input name="agenda" className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Participants</span>
            <input name="participants" className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Meeting link</span>
            <input name="meetingLink" className={inputClass()} />
          </label>
          <div className="lg:col-span-4">
            <FormSubmitButton pendingLabel="Saving..." className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
              Save Meeting
            </FormSubmitButton>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {meetings.length === 0 ? (
          <Card className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <CalendarDays size={30} className="mb-3 text-text-tertiary" />
            <p className="text-sm font-semibold text-text-primary">No meetings yet</p>
            <p className="mt-1 text-sm text-text-secondary">Schedule your first meeting above.</p>
          </Card>
        ) : meetings.map((meeting) => (
          <Card key={meeting.id} className="p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_180px_240px] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-text-primary">{meeting.title}</h2>
                  <Badge variant={statusVariant(meeting.status)}>{meeting.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{meeting.agenda || 'No agenda provided.'}</p>
                <p className="mt-2 text-xs text-text-tertiary">{meeting.participants || 'Participants not set'}</p>
              </div>
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary">{formatDateTime(meeting.scheduledAt)}</p>
                <p className="mt-1">{meeting.durationMinutes} min</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {meeting.meetingLink && (
                  <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-white px-3 text-sm font-semibold text-text-secondary hover:text-primary">
                    <ExternalLink size={14} />
                    Open
                  </a>
                )}
                {meeting.status === 'upcoming' && (
                  <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }}>
                    <input type="hidden" name="id" value={meeting.id} />
                    <input type="hidden" name="status" value="accepted" />
                    <FormSubmitButton pendingLabel="Accepting..." className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-success/20 bg-success-50 px-3 text-sm font-semibold text-success hover:bg-success/10">
                      <CheckCircle2 size={14} />
                      Accept
                    </FormSubmitButton>
                  </form>
                )}
                {meeting.status !== 'cancelled' && (
                  <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }}>
                    <input type="hidden" name="id" value={meeting.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <FormSubmitButton pendingLabel="Cancelling..." className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-danger/20 bg-danger-50 px-3 text-sm font-semibold text-danger hover:bg-danger/10">
                      <XCircle size={14} />
                      Cancel
                    </FormSubmitButton>
                  </form>
                )}
                <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }}>
                  <input type="hidden" name="id" value={meeting.id} />
                  <FormSubmitButton pendingLabel="Deleting..." className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-white px-3 text-sm font-semibold text-text-secondary hover:bg-surface-tertiary">
                    <Trash2 size={14} />
                    Delete
                  </FormSubmitButton>
                </form>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
