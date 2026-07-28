'use client';

import { CheckCircle2, Clock, GitCompareArrows, Plus, XCircle } from 'lucide-react';
import { Badge, Card, StatCard } from '@/components/ui/shared';
import { FormSubmitButton } from '@/components/ui/form-submit-button';
import { useState, useEffect } from 'react';

const changeImpacts = ['low', 'medium', 'high'];
const changePriorities = ['low', 'medium', 'high', 'critical'];
const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface ChangeRequestRecord {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  impact: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedCost: number;
  projectName: string | null;
  createdAt: string;
  adminNote: string | null;
}

interface ProjectRecord {
  id: string;
  name: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusVariant(status: ChangeRequestRecord['status']): 'purple' | 'green' | 'red' {
  if (status === 'approved') return 'green';
  if (status === 'rejected') return 'red';
  return 'purple';
}

function impactVariant(impact: ChangeRequestRecord['impact']): 'green' | 'orange' | 'red' {
  if (impact === 'low') return 'green';
  if (impact === 'medium') return 'orange';
  return 'red';
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

export default function ChangesPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ChangeRequestRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    const mockRequests: ChangeRequestRecord[] = [
      {
        id: 'mock-cr-1',
        title: 'Add dark mode support',
        status: 'pending',
        impact: 'medium',
        priority: 'medium',
        description: 'We need to add dark mode support across all pages of the dashboard.',
        estimatedCost: 50000,
        projectName: 'Website Redesign',
        createdAt: '2026-07-25T09:00:00.000Z',
        adminNote: null,
      },
      {
        id: 'mock-cr-2',
        title: 'Extend payment deadline',
        status: 'approved',
        impact: 'low',
        priority: 'high',
        description: 'Requesting to extend the payment deadline for the current milestone by 2 weeks.',
        estimatedCost: 0,
        projectName: 'Mobile App',
        createdAt: '2026-07-20T14:30:00.000Z',
        adminNote: 'Approved. The new deadline is August 15, 2026.',
      },
    ];
    const mockProjects: ProjectRecord[] = [
      { id: 'mock-proj-1', name: 'Website Redesign' },
      { id: 'mock-proj-2', name: 'Mobile App' },
    ];
    setRequests(mockRequests);
    setProjects(mockProjects);
  }, []);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Change Requests</h1>
        <p className="mt-1 text-sm text-text-secondary">Submit and track scope changes stored in the database.</p>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={String(requests.length)} icon={<GitCompareArrows size={18} />} />
        <StatCard label="Pending" value={String(requests.filter((request) => request.status === 'pending').length)} icon={<Clock size={18} />} />
        <StatCard label="Approved" value={String(requests.filter((request) => request.status === 'approved').length)} icon={<CheckCircle2 size={18} />} color="#10B981" />
        <StatCard label="Rejected" value={String(requests.filter((request) => request.status === 'rejected').length)} icon={<XCircle size={18} />} color="#EF4444" />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary-50 text-primary">
            <Plus size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">New Request</h2>
            <p className="text-sm text-text-secondary">Describe the requested change and expected impact.</p>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }} className="grid gap-4 lg:grid-cols-4">
          <label className="space-y-1.5 lg:col-span-2">
            <span className="text-xs font-medium text-text-secondary">Title</span>
            <input name="title" required className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Project</span>
            <select name="projectId" defaultValue="" className={inputClass()}>
              <option value="">No project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Estimated cost</span>
            <input name="estimatedCost" type="number" min="0" step="0.01" defaultValue="0" className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Impact</span>
            <select name="impact" defaultValue="medium" className={inputClass()}>
              {changeImpacts.map((impact) => <option key={impact} value={impact}>{impact}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Priority</span>
            <select name="priority" defaultValue="medium" className={inputClass()}>
              {changePriorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 lg:col-span-2">
            <span className="text-xs font-medium text-text-secondary">Timeline impact</span>
            <input name="timelineImpact" className={inputClass()} placeholder="+1 week, no impact, etc." />
          </label>
          <label className="space-y-1.5 lg:col-span-4">
            <span className="text-xs font-medium text-text-secondary">Description</span>
            <textarea name="description" required className="min-h-24 w-full rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <div className="lg:col-span-4">
            <FormSubmitButton pendingLabel="Submitting..." className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
              Submit Request
            </FormSubmitButton>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {requests.length === 0 ? (
          <Card className="flex flex-col items-center justify-center px-5 py-14 text-center xl:col-span-2">
            <GitCompareArrows size={30} className="mb-3 text-text-tertiary" />
            <p className="text-sm font-semibold text-text-primary">No change requests yet</p>
            <p className="mt-1 text-sm text-text-secondary">Submit your first request above.</p>
          </Card>
        ) : requests.map((request) => (
          <Card key={request.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-text-primary">{request.title}</h2>
                <p className="mt-1 text-sm text-text-secondary">{request.projectName || 'No project linked'}</p>
              </div>
              <Badge variant={statusVariant(request.status)}>{request.status}</Badge>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-secondary">{request.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-text-tertiary">Impact</p>
                <Badge variant={impactVariant(request.impact)}>{request.impact}</Badge>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Priority</p>
                <p className="mt-1 font-semibold capitalize text-text-primary">{request.priority}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Cost</p>
                <p className="mt-1 font-semibold text-text-primary">{formatCurrency(request.estimatedCost)}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Submitted</p>
                <p className="mt-1 font-semibold text-text-primary">{formatDate(request.createdAt)}</p>
              </div>
            </div>
            {request.adminNote && <p className="mt-4 rounded-[8px] bg-surface-secondary px-3 py-2 text-sm text-text-secondary">{request.adminNote}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
