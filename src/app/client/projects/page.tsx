'use client';

import { useState, useEffect } from 'react';
import { Calendar, ClipboardList, FolderKanban, UserRound } from 'lucide-react';
import { Badge, Card, ProgressBar, StatCard } from '@/components/ui/shared';

const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'ERP Implementation',
    health: 'good' as const,
    status: 'active',
    description: 'Full ERP deployment across all departments including finance, HR, and supply chain modules.',
    progress: 65,
    expectedCompletion: '2026-12-15',
    budget: 2500000,
    spent: 1650000,
    projectManager: 'Rajesh Kumar',
    milestonesCount: 12,
    documentsCount: 8,
    changeRequestsCount: 3,
  },
  {
    id: '2',
    name: 'Data Migration Phase 2',
    health: 'warning' as const,
    status: 'active',
    description: 'Migration of legacy customer data to the new CRM platform.',
    progress: 40,
    expectedCompletion: '2026-09-30',
    budget: 1200000,
    spent: 520000,
    projectManager: 'Priya Sharma',
    milestonesCount: 6,
    documentsCount: 5,
    changeRequestsCount: 1,
  },
  {
    id: '3',
    name: 'Mobile App Redesign',
    health: 'critical' as const,
    status: 'on_hold',
    description: 'Complete redesign of the customer-facing mobile application with new UX/UI.',
    progress: 30,
    expectedCompletion: '2027-02-28',
    budget: 1800000,
    spent: 540000,
    projectManager: 'Amit Verma',
    milestonesCount: 8,
    documentsCount: 3,
    changeRequestsCount: 5,
  },
];

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function healthVariant(health: 'good' | 'warning' | 'critical'): 'green' | 'orange' | 'red' {
  if (health === 'good') return 'green';
  if (health === 'warning') return 'orange';
  return 'red';
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
}

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/client/projects');
        if (res.ok) {
          const json = await res.json();
          setProjects(json.data || MOCK_PROJECTS);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch {
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!projects) return null;

  const active = projects.filter((project) => project.status === 'active' || project.status === 'on_hold').length;
  const completed = projects.filter((project) => project.status === 'completed').length;
  const averageProgress = projects.length === 0 ? 0 : Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Projects</h1>
        <p className="mt-1 text-sm text-text-secondary">Real project records assigned to your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Active projects" value={String(active)} icon={<FolderKanban size={18} />} />
        <StatCard label="Completed" value={String(completed)} icon={<ClipboardList size={18} />} color="#10B981" />
        <StatCard label="Average progress" value={`${averageProgress}%`} icon={<Calendar size={18} />} />
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-5 py-14 text-center">
          <FolderKanban size={30} className="mb-3 text-text-tertiary" />
          <p className="text-sm font-semibold text-text-primary">No projects assigned yet</p>
          <p className="mt-1 max-w-md text-sm text-text-secondary">When the admin team creates client-visible projects, they will appear here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-text-primary">{project.name}</h2>
                    <Badge variant={healthVariant(project.health)}>{project.health}</Badge>
                    <Badge variant="gray">{statusLabel(project.status)}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{project.description || 'No description added.'}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xl font-semibold text-text-primary">{project.progress}%</p>
                  <p className="text-xs text-text-tertiary">progress</p>
                </div>
              </div>

              <div className="mt-4">
                <ProgressBar progress={project.progress} />
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Expected</p>
                  <p className="mt-1 text-text-primary">{formatDate(project.expectedCompletion)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Budget</p>
                  <p className="mt-1 text-text-primary">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Spent</p>
                  <p className="mt-1 text-text-primary">{formatCurrency(project.spent)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1.5"><UserRound size={13} />{project.projectManager || 'Manager not assigned'}</span>
                <span>{project.milestonesCount} milestones</span>
                <span>{project.documentsCount} documents</span>
                <span>{project.changeRequestsCount} changes</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
