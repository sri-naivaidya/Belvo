'use client';

import { useState, useEffect } from 'react';
import { ClientTimelineView } from '@/components/client/client-timeline-view';

const MOCK_EVENTS = [
  {
    id: '1',
    type: 'milestone_completed',
    title: 'Requirements Gathering Complete',
    description: 'All business requirements have been documented and signed off.',
    date: '2026-04-10T16:30:00Z',
    projectName: 'ERP Implementation',
  },
  {
    id: '2',
    type: 'document_uploaded',
    title: 'Architecture Diagram Uploaded',
    description: 'System architecture design document has been uploaded for review.',
    date: '2026-05-20T11:00:00Z',
    projectName: 'ERP Implementation',
  },
  {
    id: '3',
    type: 'milestone_started',
    title: 'Data Migration Script Development',
    description: 'ETL script development phase has started for customer data migration.',
    date: '2026-06-01T09:00:00Z',
    projectName: 'Data Migration Phase 2',
  },
  {
    id: '4',
    type: 'project_updated',
    title: 'Budget Revised for Mobile App Redesign',
    description: 'Project budget has been revised from ₹15L to ₹18L due to scope changes.',
    date: '2026-06-15T14:45:00Z',
    projectName: 'Mobile App Redesign',
  },
  {
    id: '5',
    type: 'review_requested',
    title: 'UI/UX Wireframes Submitted for Review',
    description: 'Initial wireframes for the mobile app redesign are pending client feedback.',
    date: '2026-07-01T10:15:00Z',
    projectName: 'Mobile App Redesign',
  },
];

export default function TimelinePage() {
  const [events, setEvents] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/client/timeline');
        if (res.ok) {
          const json = await res.json();
          setEvents(json.data || MOCK_EVENTS);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch {
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!events) return null;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Timeline</h1>
        <p className="mt-1 text-sm text-text-secondary">A chronological view of project activity and upcoming work.</p>
      </div>

      <ClientTimelineView events={events} />
    </div>
  );
}
