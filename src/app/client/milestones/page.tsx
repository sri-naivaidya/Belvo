'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, ExternalLink, FileText, Milestone, XCircle } from 'lucide-react';
import { Badge, Card, ProgressBar, StatCard } from '@/components/ui/shared';

const MOCK_MILESTONES = [
  {
    id: '1',
    title: 'Requirements Gathering Complete',
    status: 'completed' as const,
    projectName: 'ERP Implementation',
    description: 'All business requirements documented and signed off by stakeholders.',
    progress: 100,
    expectedDate: '2026-04-15',
    completionDate: '2026-04-10',
    deliverables: [
      { id: 'd1', name: 'BRD Document v2.pdf', fileUrl: '#' },
      { id: 'd2', name: 'Stakeholder Signoff.pdf', fileUrl: '#' },
    ],
  },
  {
    id: '2',
    title: 'System Architecture Design',
    status: 'in_progress' as const,
    projectName: 'ERP Implementation',
    description: 'Design system architecture including database schema and API specifications.',
    progress: 60,
    expectedDate: '2026-06-30',
    completionDate: null,
    deliverables: [
      { id: 'd3', name: 'Architecture Diagram.drawio', fileUrl: '#' },
    ],
  },
  {
    id: '3',
    title: 'Data Migration Script Development',
    status: 'needs_revision' as const,
    projectName: 'Data Migration Phase 2',
    description: 'ETL scripts for migrating customer data from legacy systems.',
    progress: 85,
    expectedDate: '2026-07-15',
    completionDate: null,
    deliverables: [
      { id: 'd4', name: 'ETL_Scripts.zip', fileUrl: '#' },
      { id: 'd5', name: 'Migration_Report.xlsx', fileUrl: '#' },
    ],
  },
  {
    id: '4',
    title: 'UI/UX Wireframes',
    status: 'delayed' as const,
    projectName: 'Mobile App Redesign',
    description: 'Wireframes and mockups for the redesigned mobile application.',
    progress: 25,
    expectedDate: '2026-05-01',
    completionDate: null,
    deliverables: [],
  },
];

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusVariant(status: 'completed' | 'in_progress' | 'under_review' | 'needs_revision' | 'delayed' | 'not_started'): 'green' | 'purple' | 'orange' | 'red' | 'gray' {
  if (status === 'completed') return 'green';
  if (status === 'in_progress' || status === 'under_review') return 'purple';
  if (status === 'needs_revision') return 'orange';
  if (status === 'delayed') return 'red';
  return 'gray';
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
}

export default function ClientMilestonesPage() {
  const [milestones, setMilestones] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/client/milestones');
        if (res.ok) {
          const json = await res.json();
          setMilestones(json.data || MOCK_MILESTONES);
        } else {
          setMilestones(MOCK_MILESTONES);
        }
      } catch {
        setMilestones(MOCK_MILESTONES);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!milestones) return null;

  const completed = milestones.filter((milestone) => milestone.status === 'completed').length;
  const inProgress = milestones.filter((milestone) => milestone.status === 'in_progress' || milestone.status === 'under_review').length;
  const blocked = milestones.filter((milestone) => milestone.status === 'delayed' || milestone.status === 'needs_revision').length;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Milestones</h1>
        <p className="mt-1 text-sm text-text-secondary">Project milestones and client-visible deliverables from the database.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="In progress" value={String(inProgress)} icon={<Clock size={18} />} />
        <StatCard label="Completed" value={String(completed)} icon={<CheckCircle2 size={18} />} color="#10B981" />
        <StatCard label="Needs attention" value={String(blocked)} icon={<XCircle size={18} />} color="#EF4444" />
      </div>

      {milestones.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-5 py-14 text-center">
          <Milestone size={30} className="mb-3 text-text-tertiary" />
          <p className="text-sm font-semibold text-text-primary">No milestones yet</p>
          <p className="mt-1 max-w-md text-sm text-text-secondary">Milestones will appear after the admin team adds them to your projects.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-text-primary">{milestone.title}</h2>
                    <Badge variant={statusVariant(milestone.status)}>{statusLabel(milestone.status)}</Badge>
                  </div>
                  <p className="mt-1 text-xs font-medium text-text-tertiary">{milestone.projectName}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{milestone.description || 'No milestone detail added.'}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xl font-semibold text-text-primary">{milestone.progress}%</p>
                  <p className="text-xs text-text-tertiary">complete</p>
                </div>
              </div>

              <div className="mt-4">
                <ProgressBar progress={milestone.progress} />
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1.5"><Calendar size={13} />Expected {formatDate(milestone.expectedDate)}</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} />Completed {formatDate(milestone.completionDate)}</span>
              </div>

              {milestone.deliverables.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">Deliverables</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {milestone.deliverables.map((deliverable: any) => (
                      <a
                        key={deliverable.id}
                        href={deliverable.fileUrl ?? '#'}
                        target={deliverable.fileUrl ? '_blank' : undefined}
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-[8px] border border-border bg-surface-secondary px-3 py-2 text-sm hover:bg-surface-tertiary"
                      >
                        <FileText size={16} className="shrink-0 text-text-secondary" />
                        <span className="min-w-0 flex-1 truncate font-medium text-text-primary">{deliverable.name}</span>
                        {deliverable.fileUrl && <ExternalLink size={14} className="shrink-0 text-text-tertiary" />}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
