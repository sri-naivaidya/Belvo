'use client';

import { BarChart3, CreditCard, FolderKanban, GitCompareArrows, TrendingUp } from 'lucide-react';
import { Badge, Card, ProgressBar, StatCard } from '@/components/ui/shared';
import { useState, useEffect } from 'react';

const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function healthVariant(health: string): 'green' | 'orange' | 'red' {
  if (health === 'good') return 'green';
  if (health === 'warning') return 'orange';
  return 'red';
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
}

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const mockData = {
      projects: {
        totalBudget: 5000000,
        totalSpent: 3200000,
        total: 2,
        averageProgress: 72,
        active: 1,
        completed: 1,
      },
      payments: {
        paid: 2500000,
        outstanding: 700000,
        overdueCount: 1,
      },
      changeRequests: {
        total: 5,
        pending: 2,
        approved: 2,
        rejected: 1,
      },
      projectRows: [
        {
          id: 'mock-proj-1',
          name: 'Website Redesign',
          status: 'in_progress',
          health: 'good',
          progress: 75,
          budget: 3000000,
          spent: 2100000,
        },
        {
          id: 'mock-proj-2',
          name: 'Mobile App',
          status: 'completed',
          health: 'warning',
          progress: 100,
          budget: 2000000,
          spent: 1900000,
        },
      ],
    };
    setData(mockData);
  }, []);

  if (!data) {
    return <div className="animate-fade-in space-y-5"><p className="text-sm text-text-secondary">Loading...</p></div>;
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Reports</h1>
        <p className="mt-1 text-sm text-text-secondary">Portfolio, budget, payment, and change-request totals from live records.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total budget" value={formatCurrency(data.projects.totalBudget)} icon={<FolderKanban size={18} />} />
        <StatCard label="Total spent" value={formatCurrency(data.projects.totalSpent)} icon={<TrendingUp size={18} />} />
        <StatCard label="Paid" value={formatCurrency(data.payments.paid)} icon={<CreditCard size={18} />} color="#10B981" />
        <StatCard label="Outstanding" value={formatCurrency(data.payments.outstanding)} icon={<BarChart3 size={18} />} color="#EF4444" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-0 xl:col-span-2">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-text-primary">Project Performance</h2>
            <p className="mt-0.5 text-sm text-text-secondary">{data.projects.total} projects tracked</p>
          </div>
          <div className="divide-y divide-border">
            {data.projectRows.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-text-secondary">No project data available yet.</div>
            ) : data.projectRows.map((project: any) => {
              const spentPct = project.budget > 0 ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : 0;
              return (
                <div key={project.id} className="px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{project.name}</p>
                      <p className="text-xs text-text-secondary">{statusLabel(project.status)}</p>
                    </div>
                    <Badge variant={healthVariant(project.health)}>{project.health}</Badge>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-text-secondary">
                        <span>Delivery</span>
                        <span>{project.progress}%</span>
                      </div>
                      <ProgressBar progress={project.progress} />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-text-secondary">
                        <span>Budget used</span>
                        <span>{spentPct}%</span>
                      </div>
                      <ProgressBar progress={spentPct} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-text-primary">Portfolio Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Average progress</span>
                <span className="font-semibold text-text-primary">{data.projects.averageProgress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Active projects</span>
                <span className="font-semibold text-text-primary">{data.projects.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Completed projects</span>
                <span className="font-semibold text-text-primary">{data.projects.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Overdue payments</span>
                <span className="font-semibold text-danger">{data.payments.overdueCount}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <GitCompareArrows size={16} className="text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Change Requests</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total</span>
                <span className="font-semibold text-text-primary">{data.changeRequests.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Pending</span>
                <span className="font-semibold text-primary">{data.changeRequests.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Approved</span>
                <span className="font-semibold text-success">{data.changeRequests.approved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Rejected</span>
                <span className="font-semibold text-danger">{data.changeRequests.rejected}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
